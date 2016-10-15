#------------------------------------------------------------
#        Script MySQL.
#------------------------------------------------------------


#------------------------------------------------------------
# Table: geo_alert
#------------------------------------------------------------

CREATE TABLE geo_alert(
        id            int (11) Auto_increment  NOT NULL ,
        id_type       int (11) ,
        latitude      Double ,
        longitude     Double ,
        date_create   Date ,
        id_utilisator int (11) ,
        PRIMARY KEY (id )
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: geo_alert_type
#------------------------------------------------------------

CREATE TABLE geo_alert_type(
        id          int (11) Auto_increment  NOT NULL ,
        nom_alert   Varchar (25) ,
        value       Int ,
        speed_limit Double ,
        id_icon     int (11) ,
        id_groupe   int (11) ,
        PRIMARY KEY (id )
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: utilisateur
#------------------------------------------------------------

CREATE TABLE utilisateur(
        id          int (11) Auto_increment  NOT NULL ,
        login       Varchar (25) ,
        pswd        Varchar (25) ,
        pseudo      Varchar (25) ,
        credibilite Int ,
        PRIMARY KEY (id )
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: icon
#------------------------------------------------------------

CREATE TABLE icon(
        id   int (11) Auto_increment  NOT NULL ,
        nom  Varchar (25) ,
        link Varchar (255) ,
        PRIMARY KEY (id )
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: geo_alert_groupe
#------------------------------------------------------------

CREATE TABLE geo_alert_groupe(
        id          int (11) Auto_increment  NOT NULL ,
        nom         Varchar (25) ,
        date_crated Date ,
        id_icon     int (11) ,
        PRIMARY KEY (id )
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: geo_alert_msg
#------------------------------------------------------------

CREATE TABLE geo_alert_msg(
        id       int (11) Auto_increment  NOT NULL ,
        message  Varchar (255) ,
        id_alert int (11) ,
        PRIMARY KEY (id )
)ENGINE=InnoDB;

