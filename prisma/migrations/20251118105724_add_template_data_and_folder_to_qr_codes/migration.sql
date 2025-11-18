-- AlterEnum: Ajouter les nouveaux types QrCodeType
DO $$ 
BEGIN
    -- Ajouter les nouveaux types à l'enum s'ils n'existent pas déjà
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'URL' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'QrCodeType')) THEN
        ALTER TYPE "QrCodeType" ADD VALUE 'URL';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'PDF' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'QrCodeType')) THEN
        ALTER TYPE "QrCodeType" ADD VALUE 'PDF';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'IMAGE' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'QrCodeType')) THEN
        ALTER TYPE "QrCodeType" ADD VALUE 'IMAGE';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'VIDEO' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'QrCodeType')) THEN
        ALTER TYPE "QrCodeType" ADD VALUE 'VIDEO';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'TEXT' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'QrCodeType')) THEN
        ALTER TYPE "QrCodeType" ADD VALUE 'TEXT';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'GUEST_CARD' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'QrCodeType')) THEN
        ALTER TYPE "QrCodeType" ADD VALUE 'GUEST_CARD';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'WHATSAPP' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'QrCodeType')) THEN
        ALTER TYPE "QrCodeType" ADD VALUE 'WHATSAPP';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'SOCIAL' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'QrCodeType')) THEN
        ALTER TYPE "QrCodeType" ADD VALUE 'SOCIAL';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'MENU' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'QrCodeType')) THEN
        ALTER TYPE "QrCodeType" ADD VALUE 'MENU';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'WIFI' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'QrCodeType')) THEN
        ALTER TYPE "QrCodeType" ADD VALUE 'WIFI';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'PROGRAM' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'QrCodeType')) THEN
        ALTER TYPE "QrCodeType" ADD VALUE 'PROGRAM';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'VCARD' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'QrCodeType')) THEN
        ALTER TYPE "QrCodeType" ADD VALUE 'VCARD';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'COUPON' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'QrCodeType')) THEN
        ALTER TYPE "QrCodeType" ADD VALUE 'COUPON';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'PLAYLIST' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'QrCodeType')) THEN
        ALTER TYPE "QrCodeType" ADD VALUE 'PLAYLIST';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'GALLERY' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'QrCodeType')) THEN
        ALTER TYPE "QrCodeType" ADD VALUE 'GALLERY';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'FEEDBACK' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'QrCodeType')) THEN
        ALTER TYPE "QrCodeType" ADD VALUE 'FEEDBACK';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'LIVE_STREAM' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'QrCodeType')) THEN
        ALTER TYPE "QrCodeType" ADD VALUE 'LIVE_STREAM';
    END IF;
END $$;

-- AlterTable
ALTER TABLE "qr_codes" ADD COLUMN IF NOT EXISTS "templateData" JSONB;
ALTER TABLE "qr_codes" ADD COLUMN IF NOT EXISTS "folderId" TEXT;

-- CreateTable (si folders n'existe pas déjà)
CREATE TABLE IF NOT EXISTS "folders" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT 'purple',
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "folders_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey (si la contrainte n'existe pas déjà)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'qr_codes_folderId_fkey'
    ) THEN
        ALTER TABLE "qr_codes" ADD CONSTRAINT "qr_codes_folderId_fkey" 
        FOREIGN KEY ("folderId") REFERENCES "folders"("id") 
        ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

-- AddForeignKey pour folders (si la contrainte n'existe pas déjà)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'folders_userId_fkey'
    ) THEN
        ALTER TABLE "folders" ADD CONSTRAINT "folders_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "users"("id") 
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

