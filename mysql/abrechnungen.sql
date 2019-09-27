create table avVerkauf(
    av_abrechnung_id int not null auto_increment,
    av_abrechnung_datum date not null,
    av_abrechnung_daten varchar(65000),

    PRIMARY KEY(av_abrechnung_id)
);

create table skBestueckung(
    sk_abrechnung_id int not null auto_increment,
    sk_abrechnung_datum date not null,
    sk_abrechnung_daten varchar(65000),

    PRIMARY KEY(sk_abrechnung_id)
);