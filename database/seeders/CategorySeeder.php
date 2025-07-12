<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Technology', 'description' => 'Tech related articles'],
            ['name' => 'Business', 'description' => 'Business and entrepreneurship'],
            ['name' => 'Lifestyle', 'description' => 'Lifestyle and personal development'],
            ['name' => 'Travel', 'description' => 'Travel guides and experiences'],
            ['name' => 'Food', 'description' => 'Food recipes and reviews'],
        ];

        foreach ($categories as $category) {
            Category::create([
                'name' => $category['name'],
                'slug' => Str::slug($category['name']),
                'description' => $category['description'],
                'status' => 'active'
            ]);
        }
    }
}