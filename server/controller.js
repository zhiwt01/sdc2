const database = require('./db/index.js');

const Query = {
  getQuestions: (req, res) => {
    const productId = Number(req.query.product_id) || 1;
    const page = Number(req.query.page) || 1;
    const count = Number(req.query.count) || 5;
    if (req.query.question_id) {
      const params = [req.query.question_id, page, count, page * count];
      // console.log(params);
      database.query(
        `select  json_agg(
        json_build_object(
            'question', id,
            'page', $2 :: VARCHAR,
          'count', $3 :: VARCHAR,
            'results', ( select json_agg( json_build_object(
                    'answer_id', a.id,
            'body', answer_body,
            'date', date_written,
            'answerer_name', answerer_name,
            'helpfulness', helpful,
              'photos', ( select JSON_agg(json_build_object(
                    'id', ap.id, 'url', ap.url)
          ) from answer_photo ap where a.id = ap.answer_id  )
            )
          ) from answers a where a.question_id= q.id  limit $4 )
                ))  as output
        from questions q
        where q.id = $1;`,
        params,
        (err, serResp) => {
          if (err) {
            console.log(err);
          }
          if (serResp?.rows[0]?.output[0].results) {
            // let { rows } = serResp;
            if (req.query.product_id) {
              res.send(serResp.rows[0].output);
            } else {
              res.send(serResp.rows[0].output[0]);
            }
          } else {
            res.send('Question not found');
          }
        }
      );
    } else {
      const params = [productId];
      database.query(
        `SELECT
        JSON_BUILD_OBJECT(
          'product_id', $1 :: int,
          'results',JSON_AGG(
          JSON_BUILD_OBJECT(
            'question_id', id, 'body', question_body, 'question_date', date_written, 'asker_name', asker_name, 'question_helpfulness', helpful, 'reported', reported, 'answers',
            ( SELECT JSON_OBJECT_AGG( a.id ,
              JSON_BUILD_OBJECT('id', a.id, 'body', answer_body, 'date', date_written, 'answerer_name', answerer_name, 'helpfulness', helpful, 'photos',
            ( SELECT JSON_AGG(
              JSON_BUILD_OBJECT('id', ap.id, 'url', ap.url)) FROM answer_photo ap WHERE a.id = ap.answer_id ))) FROM answers a WHERE a.question_id= q.id))))
            as output FROM questions q WHERE product_id = $1;`,
        params,
        (err, serResp) => {
          if (err) {
            console.log(err);
          }
          if (serResp.rows[0]?.output) {
            // let { rows } = serResp;
            // console.log(serResp);
            res.send(serResp.rows[0].output);
          } else {
            res.send('no product found');
          }
        }
      );
    }
  },
  postQuestion: (req, res) => {
    const body = req.query.body;
    const email = req.query.email;
    const name = req.query.name;
    if (req.query.product_id) {
      const id = req.query.product_id;
      const params = [id, body, name, email];
      // console.log('params2 ', params);
      // console.log(req.query);
      database.query(
        `INSERT INTO questions (product_id, question_body, date_written, asker_name , asker_email, reported, helpful)
        VALUES ($1 :: int, $2 :: VARCHAR, current_timestamp, $3 :: VARCHAR, $4 :: VARCHAR, 'false', 0);`,
        params,
        (err, serResp) => {
          if (err) {
            console.log(err);
          }
          res.send('question added');
        }
      );
    } else {
      const id = req.query.question_id;
      const photo = req.query.photo|| [' '];
      const params = [body, name, email, id, photo];
      database.query(
        `WITH step_one AS (
        INSERT into answers(answer_body,answerer_name,answerer_email, question_id, date_written, reported, helpful)
        values($1 :: VARCHAR, $2 :: VARCHAR, $3 :: VARCHAR, $4 :: INT, current_timestamp, 'false', 0)
        RETURNING id
      )
      INSERT into answer_photo(answer_id, url)
      SELECT id, UNNEST(ARRAY[$5]) FROM step_one;`,
        params,
        (err, serResp) => {
          if (err) {
            console.log(err);
          }
          res.send('Answer added');
        }
      );
    }
  },
  putQuestion: (req, res) => {
    const body = req.query.body;
    const email = req.query.email;
    const name = req.query.name;
    if (req.query.product_id) {
      const id = req.query.product_id;
      const params = [id, body, name, email];
      // console.log('params2 ', params);
      // console.log(req.query);
      database.query(
        `INSERT INTO questions (product_id, question_body, date_written, asker_name , asker_email, reported, helpful)
        VALUES ($1 :: int, $2 :: VARCHAR, current_timestamp, $3 :: VARCHAR, $4 :: VARCHAR, 'false', 0);`,
        params,
        (err, serResp) => {
          if (err) {
            console.log(err);
          }
          res.send('question added');
        }
      );
    } else {
      const id = req.query.question_id;
      const photo = req.query.photo|| [' '];
      const params = [body, name, email, id, photo];
      database.query(
        `WITH step_one AS (
        INSERT into answers(answer_body,answerer_name,answerer_email, question_id, date_written, reported, helpful)
        values($1 :: VARCHAR, $2 :: VARCHAR, $3 :: VARCHAR, $4 :: INT, current_timestamp, 'false', 0)
        RETURNING id
      )
      INSERT into answer_photo(answer_id, url)
      SELECT id, UNNEST(ARRAY[$5]) FROM step_one;`,
        params,
        (err, serResp) => {
          if (err) {
            console.log(err);
          }
          res.send('Answer added');
        }
      );
    }
  },
};

module.exports = Query;

/*



POST /qa/questions/:question_id/answers
 WITH step_one AS (
  INSERT into answers(answer_body,answerer_name,answerer_email, question_id, date_written, reported)
  values('words','testing', 'sda', 3518965, current_timestamp, 'false')
  RETURNING id
)
INSERT into answer_photo(answer_id, url)
SELECT id,  unnest(ARRAY[1,2]) FROM step_one;

put /qa/questions/:question_id/helpful
 with first_insert as (
   select helpful from questions
   where id= **question_id**
   RETURNING helpful
),
second_insert as (
  update questions
  set helpful = first_insert.helpful + 1 from first_insert
  where questions.id = **questionID**
)

PUT /qa/questions/:question_id/report
 update questions
  set reported = true
  where questions.id = **questionID**



  _______
PUT /qa/answers/:answer_id/helpful
 with first_insert as (
   select helpful from answers
   where id= **answer_id**
   RETURNING helpful
),
second_insert as (
  update answers
  set helpful = first_insert.helpful + 1 from first_insert
  where answers.id = **id**
)

PUT /qa/answers/:answer_id/report
 update questions
  set reported = true
  where answers.id = **id**
 */
