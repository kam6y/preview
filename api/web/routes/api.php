<?php

use App\Http\Controllers\LoginController;
use App\Http\Controllers\MeasureController;
use App\Http\Controllers\EngagementSurveyQuestionController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\PulseSurveyQuestionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
//ログイン
Route::post('/login', [App\Http\Controllers\Auth\LoginController::class, 'login']);
// CSRFトークンなしで動作するログインルート
Route::post('/login-no-csrf', [App\Http\Controllers\Auth\LoginController::class, 'loginNoCsrf']);

// 管理者用ルート
Route::middleware(['auth.admin'])->prefix('admin')->group(function () {
    // 他の管理者用ルート
});

// 人事部用ルート
Route::middleware(['auth.personnel'])->prefix('personnel')->group(function () {
    // 他の人事部用ルート
});

// 管理職用ルート
Route::middleware(['auth.manager'])->prefix('manager')->group(function () {
    // 他の管理職用ルート
});

//エンゲージメントサーベイ質問項目取得
Route::get('/engagement-survey-questions/{tenant_id}/{instance_id}', [EngagementSurveyQuestionController::class, 'index']);
Route::get('/pulse-survey-questions/{tenant_id}/{instance_id}', [PulseSurveyQuestionController::class, 'index']);
//組織名の取得
Route::get('/departments', [DepartmentController::class, 'index']);
Route::get('/departments/{parentId}/children', [DepartmentController::class, 'children']);
// リレーションを直接使った取得例（必要に応じて）
Route::get('/departments/{parentId}/children-relation', [DepartmentController::class, 'childrenUsingRelation']);

//施策取得
Route::get('/measures', [MeasureController::class, 'index'] );

