create table rohgetraenke(
    drink_id int not null auto_increment,
    drink_name varchar(100) not null,
    bottle_size float not null,
    bottle_cost float not null,
    internal_price float not null,
    addition_price float not null,
    portion_size float not null,
    portion_price_rounded float not null,
    external_price_bottle float not null,
    weight_bottle float not null,
    skListe boolean not null,
    avVerkauf boolean not null,
    bierKarte boolean not null,
    barKarte boolean not null,
    abrechnung boolean not null,

    PRIMARY KEY(drink_id)
);

create table snacks(
    snack_id int not null auto_increment,
    snack_name varchar(100) not null,
    snack_cost float not null,
    snack_price float not null,
    skListe boolean not null,
    avVerkauf boolean not null,
    bierKarte boolean not null,
    barKarte boolean not null,
    abrechnung boolean not null,

    PRIMARY KEY(snack_id)
);