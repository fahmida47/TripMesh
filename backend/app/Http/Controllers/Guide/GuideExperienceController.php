<?php

namespace App\Http\Controllers\Guide;

use App\Http\Controllers\Controller;
use App\Models\Guide\GuideExperience;
use App\Models\Guide\GuideProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;


class GuideExperienceController extends Controller
{


public function store(Request $request)
{

    $user = auth('api')->user();


    if(!$user){

        return response()->json([
            'message'=>'Unauthenticated'
        ],401);

    }



    $profile = GuideProfile::where(
        'user_id',
        $user->id
    )->first();



    if(!$profile){

        return response()->json([
            'message'=>'Guide profile not found'
        ],404);

    }



    $validated = $request->validate([

        'title'=>'required|string|max:255',

        'description'=>'required|string|max:300',

        'photo'=>'nullable|image|mimes:jpg,jpeg,png,webp|max:5120'

    ]);



    $photo=null;



    if($request->hasFile('photo')){

        $photo=$request
        ->file('photo')
        ->store(
            'guide-experiences',
            'public'
        );

    }



    $experience = GuideExperience::create([

        'guide_profile_id'=>$profile->id,

        'title'=>$validated['title'],

        'description'=>$validated['description'],

        'photo'=>$photo

    ]);




    return response()->json([

        'message'=>'Experience added successfully',

        'experience'=>$experience

    ],201);

}






public function update(Request $request,$id)
{

$user=auth('api')->user();



$profile=GuideProfile::where(
'user_id',
$user->id
)->first();



$experience=GuideExperience::where(
'id',$id
)
->where(
'guide_profile_id',
$profile->id
)
->first();



if(!$experience){

return response()->json([
'message'=>'Experience not found'
],404);

}




$request->validate([

'title'=>'required|string|max:255',

'description'=>'required|string|max:300',

'photo'=>'nullable|image|max:5120'

]);




if($request->hasFile('photo')){


if($experience->photo){

Storage::disk('public')
->delete($experience->photo);

}


$experience->photo=$request
->file('photo')
->store(
'guide-experiences',
'public'
);

}



$experience->title=$request->title;

$experience->description=$request->description;


$experience->save();



return response()->json([

'message'=>'Updated',

'experience'=>$experience

]);

}







public function destroy($id)
{

$user=auth('api')->user();


$profile=GuideProfile::where(
'user_id',
$user->id
)->first();



$experience=GuideExperience::where(
'id',$id
)
->where(
'guide_profile_id',
$profile->id
)
->first();



if(!$experience){

return response()->json([
'message'=>'Not found'
],404);

}



if($experience->photo){

Storage::disk('public')
->delete($experience->photo);

}



$experience->delete();



return response()->json([

'message'=>'Deleted'

]);

}


}