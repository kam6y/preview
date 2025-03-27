<?php

namespace App\Http\Controllers;

use App\Models\Measure;
use Illuminate\Http\Request;

class MeasureController extends Controller
{
    public function index(){
        $measures = Measure::with(['department'])
            ->where('department_id', 1)
            ->get();

        return response()->json($measures);
    }
}
