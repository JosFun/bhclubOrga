create table av_verkauf(
    av_abrechnung_id int not null auto_increment,
    av_abrechnung_datum date not null,

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
