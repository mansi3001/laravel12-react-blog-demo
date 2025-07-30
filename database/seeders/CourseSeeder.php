<?php

namespace Database\Seeders;

use App\Models\Course;
use Illuminate\Database\Seeder;

class CourseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $courses = [
            'Computer Science',
            'Mathematics',
            'Physics',
            'Chemistry',
            'Biology'
        ];

        foreach ($courses as $course) {
            Course::create(['name' => $course]);
        }
    }
}
