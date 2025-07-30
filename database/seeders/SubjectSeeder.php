<?php

namespace Database\Seeders;

use App\Models\Subject;
use Illuminate\Database\Seeder;

class SubjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $subjects = [
            // Computer Science subjects
            ['name' => 'Programming', 'course_id' => 1],
            ['name' => 'Data Structures', 'course_id' => 1],
            ['name' => 'Algorithms', 'course_id' => 1],
            
            // Mathematics subjects
            ['name' => 'Calculus', 'course_id' => 2],
            ['name' => 'Algebra', 'course_id' => 2],
            ['name' => 'Statistics', 'course_id' => 2],
            
            // Physics subjects
            ['name' => 'Mechanics', 'course_id' => 3],
            ['name' => 'Thermodynamics', 'course_id' => 3],
            
            // Chemistry subjects
            ['name' => 'Organic Chemistry', 'course_id' => 4],
            ['name' => 'Inorganic Chemistry', 'course_id' => 4],
            
            // Biology subjects
            ['name' => 'Genetics', 'course_id' => 5],
            ['name' => 'Ecology', 'course_id' => 5],
        ];

        foreach ($subjects as $subject) {
            Subject::create($subject);
        }
    }
}
