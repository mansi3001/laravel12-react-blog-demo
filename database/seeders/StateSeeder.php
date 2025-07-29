<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Country;
use App\Models\State;

class StateSeeder extends Seeder
{
    public function run(): void
    {
        $usa = Country::where('iso_code', 'US')->first();
        $canada = Country::where('iso_code', 'CA')->first();
        $india = Country::where('iso_code', 'IN')->first();

        if ($usa) {
            $usStates = [
                ['name' => 'California', 'code' => 'CA'],
                ['name' => 'New York', 'code' => 'NY'],
                ['name' => 'Texas', 'code' => 'TX'],
                ['name' => 'Florida', 'code' => 'FL'],
            ];

            foreach ($usStates as $state) {
                State::firstOrCreate(
                    ['country_id' => $usa->id, 'code' => $state['code']],
                    array_merge($state, ['country_id' => $usa->id])
                );
            }
        }

        if ($canada) {
            $canadaStates = [
                ['name' => 'Ontario', 'code' => 'ON'],
                ['name' => 'Quebec', 'code' => 'QC'],
                ['name' => 'British Columbia', 'code' => 'BC'],
            ];

            foreach ($canadaStates as $state) {
                State::firstOrCreate(
                    ['country_id' => $canada->id, 'code' => $state['code']],
                    array_merge($state, ['country_id' => $canada->id])
                );
            }
        }

        if ($india) {
            $indiaStates = [
                ['name' => 'Maharashtra', 'code' => 'MH'],
                ['name' => 'Karnataka', 'code' => 'KA'],
                ['name' => 'Tamil Nadu', 'code' => 'TN'],
            ];

            foreach ($indiaStates as $state) {
                State::firstOrCreate(
                    ['country_id' => $india->id, 'code' => $state['code']],
                    array_merge($state, ['country_id' => $india->id])
                );
            }
        }
    }
}