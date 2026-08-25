<?php

namespace App\Entity;

use App\Repository\ProductRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ProductRepository::class)]
class Product
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $_id = null;

    #[ORM\Column(nullable: true)]
    private ?int $ProductId = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $Gender = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $Category = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $SubCategory = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $ProductType = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $Colour = null;

    #[ORM\Column(length: 2000, nullable: true)]
    private ?string $ProductUsage = null;

    #[ORM\Column(length: 1000)]
    private ?string $ProductTitle = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $Image = null;

    #[ORM\Column(length: 1000, nullable: true)]
    private ?string $ImageURL = null;

    #[ORM\Column(nullable: true)]
    private ?float $Price = null;

    #[ORM\Column(length: 1000, nullable: true)]
    private ?string $CategoryImage = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function get_id(): ?string
    {
        return $this->_id;
    }

    public function set_id(?string $_id): static
    {
        $this->_id = $_id;

        return $this;
    }

    public function getProductId(): ?int
    {
        return $this->ProductId;
    }

    public function setProductId(?int $ProductId): static
    {
        $this->ProductId = $ProductId;

        return $this;
    }

    public function getGender(): ?string
    {
        return $this->Gender;
    }

    public function setGender(?string $Gender): static
    {
        $this->Gender = $Gender;

        return $this;
    }

    public function getCategory(): ?string
    {
        return $this->Category;
    }

    public function setCategory(?string $Category): static
    {
        $this->Category = $Category;

        return $this;
    }

    public function getSubCategory(): ?string
    {
        return $this->SubCategory;
    }

    public function setSubCategory(?string $SubCategory): static
    {
        $this->SubCategory = $SubCategory;

        return $this;
    }

    public function getProductType(): ?string
    {
        return $this->ProductType;
    }

    public function setProductType(?string $ProductType): static
    {
        $this->ProductType = $ProductType;

        return $this;
    }

    public function getColour(): ?string
    {
        return $this->Colour;
    }

    public function setColour(?string $Colour): static
    {
        $this->Colour = $Colour;

        return $this;
    }

    public function getProductUsage(): ?string
    {
        return $this->ProductUsage;
    }

    public function setProductUsage(?string $ProductUsage): static
    {
        $this->ProductUsage = $ProductUsage;

        return $this;
    }

    public function getProductTitle(): ?string
    {
        return $this->ProductTitle;
    }

    public function setProductTitle(string $ProductTitle): static
    {
        $this->ProductTitle = $ProductTitle;

        return $this;
    }

    public function getImage(): ?string
    {
        return $this->Image;
    }

    public function setImage(?string $Image): static
    {
        $this->Image = $Image;

        return $this;
    }

    public function getImageURL(): ?string
    {
        return $this->ImageURL;
    }

    public function setImageURL(?string $ImageURL): static
    {
        $this->ImageURL = $ImageURL;

        return $this;
    }

    public function getPrice(): ?float
    {
        return $this->Price;
    }

    public function setPrice(?float $Price): static
    {
        $this->Price = $Price;

        return $this;
    }

    public function getCategoryImage(): ?string
    {
        return $this->CategoryImage;
    }

    public function setCategoryImage(?string $CategoryImage): static
    {
        $this->CategoryImage = $CategoryImage;

        return $this;
    }
}