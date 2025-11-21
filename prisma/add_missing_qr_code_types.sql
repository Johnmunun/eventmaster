-- Script SQL pour ajouter les valeurs manquantes à l'enum QrCodeType
-- À exécuter manuellement dans votre base de données PostgreSQL (Neon)
-- quand la connexion sera rétablie

-- Ajouter les valeurs manquantes à l'enum QrCodeType
ALTER TYPE "QrCodeType" ADD VALUE IF NOT EXISTS 'EMAIL';
ALTER TYPE "QrCodeType" ADD VALUE IF NOT EXISTS 'SMS';
ALTER TYPE "QrCodeType" ADD VALUE IF NOT EXISTS 'LOCATION';
ALTER TYPE "QrCodeType" ADD VALUE IF NOT EXISTS 'PHONE';
ALTER TYPE "QrCodeType" ADD VALUE IF NOT EXISTS 'BITCOIN';
ALTER TYPE "QrCodeType" ADD VALUE IF NOT EXISTS 'EVENTBRITE';

-- Vérifier que les valeurs ont été ajoutées
SELECT unnest(enum_range(NULL::"QrCodeType")) AS "QrCodeType";

