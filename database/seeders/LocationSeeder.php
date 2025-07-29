<?php

namespace Database\Seeders;

use App\Models\City;
use App\Models\Country;
use App\Models\State;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Countries
        $usa = Country::create(['name' => 'United States', 'code' => 'US']);
        $india = Country::create(['name' => 'India', 'code' => 'IN']);
        $canada = Country::create(['name' => 'Canada', 'code' => 'CA']);

        // Create States for USA
        $california = State::create(['name' => 'California', 'code' => 'CA', 'country_id' => $usa->id]);
        $texas = State::create(['name' => 'Texas', 'code' => 'TX', 'country_id' => $usa->id]);
        $newYork = State::create(['name' => 'New York', 'code' => 'NY', 'country_id' => $usa->id]);

        // Create States for India
        $gujarat = State::create(['name' => 'Gujarat', 'code' => 'GJ', 'country_id' => $india->id]);
        $maharashtra = State::create(['name' => 'Maharashtra', 'code' => 'MH', 'country_id' => $india->id]);
        $karnataka = State::create(['name' => 'Karnataka', 'code' => 'KA', 'country_id' => $india->id]);

        // Create States for Canada
        $ontario = State::create(['name' => 'Ontario', 'code' => 'ON', 'country_id' => $canada->id]);
        $quebec = State::create(['name' => 'Quebec', 'code' => 'QC', 'country_id' => $canada->id]);
        $britishColumbia = State::create(['name' => 'British Columbia', 'code' => 'BC', 'country_id' => $canada->id]);

        // Create Cities for California
        City::create(['name' => 'Los Angeles', 'state_id' => $california->id]);
        City::create(['name' => 'San Francisco', 'state_id' => $california->id]);
        City::create(['name' => 'San Diego', 'state_id' => $california->id]);

        // Create Cities for Texas
        City::create(['name' => 'Houston', 'state_id' => $texas->id]);
        City::create(['name' => 'Dallas', 'state_id' => $texas->id]);
        City::create(['name' => 'Austin', 'state_id' => $texas->id]);

        // Create Cities for New York
        City::create(['name' => 'New York City', 'state_id' => $newYork->id]);
        City::create(['name' => 'Buffalo', 'state_id' => $newYork->id]);
        City::create(['name' => 'Albany', 'state_id' => $newYork->id]);

        // Create Cities for Gujarat
        City::create(['name' => 'Ahmedabad', 'state_id' => $gujarat->id]);
        City::create(['name' => 'Surat', 'state_id' => $gujarat->id]);
        City::create(['name' => 'Vadodara', 'state_id' => $gujarat->id]);

        // Create Cities for Maharashtra
        City::create(['name' => 'Mumbai', 'state_id' => $maharashtra->id]);
        City::create(['name' => 'Pune', 'state_id' => $maharashtra->id]);
        City::create(['name' => 'Nagpur', 'state_id' => $maharashtra->id]);

        // Create Cities for Karnataka
        City::create(['name' => 'Bangalore', 'state_id' => $karnataka->id]);
        City::create(['name' => 'Mysore', 'state_id' => $karnataka->id]);
        City::create(['name' => 'Mangalore', 'state_id' => $karnataka->id]);

        // Create Cities for Ontario
        City::create(['name' => 'Toronto', 'state_id' => $ontario->id]);
        City::create(['name' => 'Ottawa', 'state_id' => $ontario->id]);
        City::create(['name' => 'Hamilton', 'state_id' => $ontario->id]);

        // Create Cities for Quebec
        City::create(['name' => 'Montreal', 'state_id' => $quebec->id]);
        City::create(['name' => 'Quebec City', 'state_id' => $quebec->id]);
        City::create(['name' => 'Laval', 'state_id' => $quebec->id]);

        // Create Cities for British Columbia
        City::create(['name' => 'Vancouver', 'state_id' => $britishColumbia->id]);
        City::create(['name' => 'Victoria', 'state_id' => $britishColumbia->id]);
        City::create(['name' => 'Burnaby', 'state_id' => $britishColumbia->id]);
    }
}
