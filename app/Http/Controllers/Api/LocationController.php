<?php

// LocationController
// app/Http/Controllers/LocationController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Country;
use App\Models\State;
use App\Models\City;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LocationController extends Controller
{
    public function index()
    {
        $countries = Country::orderBy('name')->get();
        
        return Inertia::render('LocationForm/Index', [
            'countries' => $countries
        ]);
    }

    public function getStates(Request $request, $countryId)
    {
        $states = State::where('country_id', $countryId)
                      ->orderBy('name')
                      ->get();
        
        return response()->json($states);
    }

    public function getCities(Request $request, $stateId)
    {
        $cities = City::where('state_id', $stateId)
                     ->orderBy('name')
                     ->get();
        
        return response()->json($cities);
    }

    public function store(Request $request)
    {
        $request->validate([
            'country_id' => 'required|exists:countries,id',
            'state_id' => 'required|exists:states,id',
            'city_id' => 'required|exists:cities,id',
        ]);

        // Store the location data
        // You can save this to another model or process as needed
        
        return redirect()->back()->with('success', 'Location selected successfully!');
    }
}
