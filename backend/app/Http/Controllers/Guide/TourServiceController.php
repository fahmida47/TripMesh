<?php

namespace App\Http\Controllers\Guide;

use App\Http\Controllers\Controller;
use App\Models\Guide\GuideProfile;
use App\Models\Guide\TourService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class TourServiceController extends Controller
{
    public function index()
    {
        return response()->json([
            'services' => TourService::with(['guideProfile.user'])
                ->latest()->paginate(12),
        ]);
    }

    public function mine(Request $request)
    {
        $profile = $this->guideProfile($request);
        if ($profile instanceof \Illuminate\Http\JsonResponse) return $profile;

        return response()->json([
            'services' => $profile->tourServices()->latest()->get(),
        ]);
    }

    public function show(TourService $tourService)
    {
        return response()->json(['service' => $tourService->load('guideProfile.user')]);
    }

    public function store(Request $request)
    {
        $profile = $this->guideProfile($request);
        if ($profile instanceof \Illuminate\Http\JsonResponse) return $profile;

        $data = $this->validated($request);
        if ($data instanceof \Illuminate\Http\JsonResponse) return $data;
        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('tour-services', 'public');
        }

        $service = $profile->tourServices()->create($data);
        return response()->json(['message' => 'Tour service created successfully.', 'service' => $service], 201);
    }

    public function update(Request $request, TourService $tourService)
    {
        $profile = $this->guideProfile($request);
        if ($profile instanceof \Illuminate\Http\JsonResponse) return $profile;
        if ($tourService->guide_profile_id !== $profile->id) {
            return response()->json(['message' => 'Tour service not found.'], 404);
        }

        $data = $this->validated($request);
        if ($data instanceof \Illuminate\Http\JsonResponse) return $data;
        if ($request->hasFile('image')) {
            if ($tourService->image) Storage::disk('public')->delete($tourService->image);
            $data['image'] = $request->file('image')->store('tour-services', 'public');
        }
        $tourService->update($data);

        return response()->json(['message' => 'Tour service updated successfully.', 'service' => $tourService]);
    }

    public function destroy(Request $request, TourService $tourService)
    {
        $profile = $this->guideProfile($request);
        if ($profile instanceof \Illuminate\Http\JsonResponse) return $profile;
        if ($tourService->guide_profile_id !== $profile->id) {
            return response()->json(['message' => 'Tour service not found.'], 404);
        }
        if ($tourService->image) Storage::disk('public')->delete($tourService->image);
        $tourService->delete();

        return response()->json(['message' => 'Tour service deleted successfully.']);
    }

    private function guideProfile(Request $request)
    {
        $user = $request->user('api');
        if (!$user || $user->role !== 'guide') {
            return response()->json(['message' => 'Only guides can manage tour services.'], 403);
        }
        $profile = GuideProfile::where('user_id', $user->id)->first();
        if (!$profile) return response()->json(['message' => 'Guide profile not found.'], 404);
        return $profile;
    }

    private function validated(Request $request)
    {
        return validator($request->all(), [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:5000'],
            'location' => ['required', 'string', 'max:255'],
            'tour_type' => ['required', 'string', 'max:100'],
            'price' => ['required', 'numeric', 'min:0', 'max:99999999.99'],
            'duration' => ['required', 'string', 'max:100'],
            'max_travelers' => ['required', 'integer', 'min:1', 'max:65535'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ])->validate();
    }
}
