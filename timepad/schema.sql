drop table if exists user;
drop table if exists timeline; 

create table user (
  id integer primary key autoincrement,
  username text unique not null,
  password text not null
);

create table timeline (
  id integer primary key autoincrement,
  author_id integer not null,
  colors text not null,
  frames text not null,
  foreign key (author_id) references user (id)
);

