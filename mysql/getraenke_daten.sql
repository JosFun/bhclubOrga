create table getraenke_daten(
    drink_id int not null auto_increment,
    drink_name varchar(100) not null,
    bottle_size float not null,
    bottle_cost float not null,
    litre_cost float not null,
    internal_price float not null,
    addition_price float not null,
    portion_size float not null,
    portion_price_calc float not null,
    external_price_bottle float not null,
    waldhoff_price float,
    metro_price float,
    jacklein_price float,
    price_lookup_date date,
    skListe boolean not null,
    avVerkauf boolean not null,
    bierKarte boolean not null,
    barKarte boolean not null,

    PRIMARY KEY(drink_id)
);