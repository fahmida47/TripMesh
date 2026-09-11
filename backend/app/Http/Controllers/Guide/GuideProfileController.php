<?php

namespace App\Http\Controllers\Guide;

use App\Http\Controllers\Controller;
use App\Models\Guide\GuideProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class GuideProfileController extends Controller
{

    public function show()
    {
        $user = auth('api')->user();

        if (!$user) {
            return response()->json([
                'message'=>'Unauthenticated'
            ],401);
        }


        $profile = GuideProfile::with('experiences')
            ->where('user_id',$user->id)
            ->first();


        if(!$profile){
            return response()->json([
                'message'=>'Guide profile not found.'
            ],404);
        }


        return response()->json([
            'profile'=>$profile
        ]);
    }



    public function update(Request $request)
    {
        $user = auth('api')->user();


        if(!$user){
            return response()->json([
                'message'=>'Unauthenticated'
            ],401);
        }


        $validated = $request->validate([

            'company_name'=>'nullable|string|max:255',

            'contact_person'=>'nullable|string|max:255',

            'bio'=>'nullable|string|max:1000',

            'phone'=>'nullable|string|max:30',

            'email'=>'nullable|email|max:255',

            'address'=>'nullable|string|max:500',

            'price'=>'nullable|numeric|min:0',

            'min_price'=>'nullable|numeric|min:0',

            'max_price'=>'nullable|numeric|gte:min_price',

            'tour_types'=>'nullable|array',

        ]);



        $profile = GuideProfile::firstOrCreate(
            ['user_id' => $user->id],
            [
                'company_name' => $validated['company_name'] ?? '',
                'email' => $validated['email'] ?? $user->email,
                'min_price' => $validated['min_price'] ?? ($validated['price'] ?? 0),
                'max_price' => $validated['max_price'] ?? ($validated['min_price'] ?? ($validated['price'] ?? 0)),
                'price' => 0,
                'rating' => 0,
                'reviews' => 0,
                'popularity' => 0,
                'tour_types' => [],
            ]
        );

        $profile->update($validated);



        return response()->json([
            'message'=>'Profile updated successfully',
            'profile'=>$profile->load('experiences')
        ]);
    }




    public function uploadProfilePicture(Request $request)
    {

        $user = auth('api')->user();


        if(!$user){
            return response()->json([
                'message'=>'Unauthenticated'
            ],401);
        }



        $request->validate([
            'profile_picture' => [
                'required',
                'image',
                'mimetypes:image/jpeg,image/png,image/webp',
                'max:5120',
            ],
        ]);



        $profile = GuideProfile::where(
            'user_id',
            $user->id
        )->first();



        if(!$profile){

            return response()->json([
                'message'=>'Profile not found'
            ],404);

        }




        if($profile->profile_picture){

            Storage::disk('public')
            ->delete(
                $profile->profile_picture
            );

        }




        $path = $request
            ->file('profile_picture')
            ->store(
                'guide/profile-pictures',
                'public'
            );



        $profile->update([

            'profile_picture'=>$path

        ]);



        return response()->json([

            'message'=>'Profile picture uploaded successfully',

            'profile_picture'=>$path

        ]);

    }







    public function uploadCoverPhoto(Request $request)
    {

        $user = auth('api')->user();


        if(!$user){
            return response()->json([
                'message'=>'Unauthenticated'
            ],401);
        }



        $request->validate([

            'cover_photo'=>
            'required|image|mimes:jpg,jpeg,png,webp|max:5120'

        ]);




        $profile = GuideProfile::where(
            'user_id',
            $user->id
        )->first();



        if(!$profile){

            return response()->json([
                'message'=>'Profile not found'
            ],404);

        }



        if($profile->cover_photo){

            Storage::disk('public')
            ->delete(
                $profile->cover_photo
            );

        }




        $path = $request
            ->file('cover_photo')
            ->store(
                'guide/cover-photos',
                'public'
            );




        $profile->update([

            'cover_photo'=>$path

        ]);



        return response()->json([

            'message'=>'Cover uploaded successfully',

            'cover_photo'=>$path

        ]);

    }






    public function explore(Request $request)
    {

        $query = GuideProfile::with('experiences');


        if($request->filled('search')){

            $search = $request->search;


            $query->where(function($q) use($search){

                $q->where(
                    'company_name',
                    'like',
                    "%$search%"
                )

                ->orWhere(
                    'address',
                    'like',
                    "%$search%"
                )

                ->orWhere(
                    'bio',
                    'like',
                    "%$search%"
                );

            });

        }


        return response()->json(
            $query->paginate(6)
        );

    }

}