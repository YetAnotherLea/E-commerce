<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260414133440 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE product CHANGE product_usage product_usage VARCHAR(2000) DEFAULT NULL, CHANGE product_title product_title VARCHAR(1000) NOT NULL, CHANGE image_url image_url VARCHAR(1000) DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE product CHANGE product_usage product_usage VARCHAR(255) DEFAULT NULL, CHANGE product_title product_title VARCHAR(255) NOT NULL, CHANGE image_url image_url VARCHAR(255) DEFAULT NULL');
    }
}
