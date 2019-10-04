create table av_verkauf(
    av_abrechnung_id int not null auto_increment,
    av_abrechnung_datum varchar(100) not null,
    money_count_100 int not null,
    money_count_50 int not null,
    money_count_20 int not null,
    money_count_10 int not null,
    money_count_5 int not null,
    money_count_2 int not null,
    money_count_1 int not null,
    money_count_05 int not null,
    money_count_02 int not null,
    money_count_01 int not null,
    money_count_005 int not null,
    money_count_002 int not null,
    money_count_001 int not null,

    PRIMARY KEY(av_abrechnung_id)
);

create table av_drinks(
    av_abrechnung_id int not null,
    drink_id int not null,
    drink_count int not null,

    PRIMARY KEY(av_abrechnung_id, drink_id),
    FOREIGN KEY(av_abrechnung_id) references bhclub.av_verkauf(av_abrechnung_id),
    FOREIGN KEY(drink_id) references bhclub.rohgetraenke(drink_id)
);

create table av_snacks(
    av_abrechnung_id int not null,
    snack_id int not null,
    snack_count int not null,

    PRIMARY KEY(av_abrechnung_id, snack_id),
    FOREIGN KEY(av_abrechnung_id) references bhclub.av_verkauf(av_abrechnung_id),
    FOREIGN KEY(snack_id) references bhclub.snacks(snack_id)
);
