import React, { useState, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function LocationForm({ countries }) {
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [loadingStates, setLoadingStates] = useState(false);
    const [loadingCities, setLoadingCities] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        country_id: '',
        state_id: '',
        city_id: '',
    });

    // Reset states and cities when country changes
    useEffect(() => {
        if (data.country_id) {
            setData(prevData => ({
                ...prevData,
                state_id: '',
                city_id: ''
            }));
            setCities([]);
            fetchStates(data.country_id);
        } else {
            setStates([]);
            setCities([]);
        }
    }, [data.country_id]);

    // Reset cities when state changes
    useEffect(() => {
        if (data.state_id) {
            setData(prevData => ({
                ...prevData,
                city_id: ''
            }));
            fetchCities(data.state_id);
        } else {
            setCities([]);
        }
    }, [data.state_id]);

    const fetchStates = (countryId) => {
        setLoadingStates(true);
        router.get(`/states/${countryId}`, {}, {
            only: ['states'],
            preserveState: true,
            onSuccess: (page) => {
                setStates(page.props.states || []);
                setLoadingStates(false);
            },
            onError: () => {
                setStates([]);
                setLoadingStates(false);
            }
        });
    };

    const fetchCities = async (stateId) => {
        setLoadingCities(true);
        try {
            const response = await fetch(`/cities/${stateId}`);
            const citiesData = await response.json();
            setCities(citiesData);
        } catch (error) {
            console.error('Error fetching cities:', error);
        } finally {
            setLoadingCities(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/location-form', {
            onSuccess: () => {
                reset();
                setStates([]);
                setCities([]);
            }
        });
    };

    return (
        <AppLayout>
            <Head title="Location Form" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Country Dropdown */}
                                <div>
                                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                                        Country
                                    </label>
                                    <select
                                        id="country"
                                        value={data.country_id}
                                        onChange={(e) => setData('country_id', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        <option value="">Select a country</option>
                                        {countries.map((country) => (
                                            <option key={country.id} value={country.id}>
                                                {country.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.country_id && (
                                        <p className="mt-1 text-sm text-red-600">{errors.country_id}</p>
                                    )}
                                </div>

                                {/* State Dropdown */}
                                <div>
                                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                                        State/Province
                                    </label>
                                    <select
                                        id="state"
                                        value={data.state_id}
                                        onChange={(e) => setData('state_id', e.target.value)}
                                        disabled={!data.country_id || loadingStates}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    >
                                        <option value="">
                                            {loadingStates ? 'Loading states...' : 'Select a state'}
                                        </option>
                                        {states.map((state) => (
                                            <option key={state.id} value={state.id}>
                                                {state.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.state_id && (
                                        <p className="mt-1 text-sm text-red-600">{errors.state_id}</p>
                                    )}
                                </div>

                                {/* City Dropdown */}
                                <div>
                                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                                        City
                                    </label>
                                    <select
                                        id="city"
                                        value={data.city_id}
                                        onChange={(e) => setData('city_id', e.target.value)}
                                        disabled={!data.state_id || loadingCities}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    >
                                        <option value="">
                                            {loadingCities ? 'Loading cities...' : 'Select a city'}
                                        </option>
                                        {cities.map((city) => (
                                            <option key={city.id} value={city.id}>
                                                {city.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.city_id && (
                                        <p className="mt-1 text-sm text-red-600">{errors.city_id}</p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <div>
                                    <button
                                        type="submit"
                                        disabled={processing || !data.country_id || !data.state_id || !data.city_id}
                                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    >
                                        {processing ? 'Submitting...' : 'Submit Location'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}