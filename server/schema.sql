DROP DATABASE IF EXISTS faq;
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS answer_photo;
DROP TABLE IF EXISTS answers;
CREATE DATABASE faq;

\c faq;
set work_mem to ' 50 MB';
CREATE TABLE questions ( id bigserial PRIMARY KEY, product_id int NOT NULL, question_body varchar(1000) NOT NULL, date_written bigint NOT NULL, asker_name varchar(60) NOT NULL, asker_email varchar(70) NOT NULL, reported boolean, helpful int );

COPY questions FROM '/Users/laptop/Desktop/work/den17/SDC/data/questions.csv' WITH (FORMAT CSV, HEADER true);

CREATE TABLE answer_photo ( id bigserial PRIMARY KEY, answer_id int NOT NULL, url varchar(1000) NOT NULL );

COPY answer_photo FROM '/Users/laptop/Desktop/work/den17/SDC/data/answers_photos.csv' WITH (FORMAT CSV, HEADER true);

CREATE TABLE answers ( id bigserial PRIMARY KEY, question_id int NOT NULL, answer_body varchar(1000) NOT NULL, date_written bigint NOT NULL, answerer_name varchar(60) NOT NULL, answerer_email varchar(70) NOT NULL, reported boolean, helpful int );

COPY answers FROM '/Users/laptop/Desktop/work/den17/SDC/data/answers.csv' WITH (FORMAT CSV, HEADER true);

ALTER TABLE answers ADD CONSTRAINT fk_answers_questions FOREIGN KEY (question_id) REFERENCES questions (id);
ALTER TABLE answer_photo ADD CONSTRAINT fk_answer_photo_answers FOREIGN KEY (answer_id) REFERENCES answers (id);

ALTER TABLE answers ALTER COLUMN date_written SET DATA TYPE timestamp USING timestamp 'epoch' + (date_written /1000) * interval '1 second';
ALTER TABLE questions ALTER COLUMN date_written SET DATA TYPE timestamp USING timestamp 'epoch' + (date_written /1000) * interval '1 second';



CREATE INDEX productID_question_index on questions( product_id asc);
CREATE INDEX questionID_answers_index on answers( question_id asc);
CREATE INDEX answerID_answerPhotoIndex on answer_photo( answer_id asc);
CREATE INDEX productId_index ON questions (product_id asc);
SELECT setval('questions_id_seq', (SELECT MAX(id) from questions));
SELECT setval('answers_id_seq', (SELECT MAX(id) from answers));
SELECT setval('answer_photo_id_seq', (SELECT MAX(id) from answers));



