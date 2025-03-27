<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Department;
use App\Models\DepartmentRelation;

class DepartmentController extends Controller
{
    /**
     * ① トップレベル部署一覧の取得
     *    departments_relationテーブルのchild_department_id に載っている部門は子部署なので
     *    そこに含まれないものを「トップレベル部署」として扱う例
     */
    public function index()
    {
        // 全ての child_department_id を取得
        $childIds = DepartmentRelation::pluck('child_department_id');
        // child_department_id に含まれない部署IDが「最上位部署」
        $topLevelDepartments = Department::whereNotIn('id', $childIds)->get();

        return response()->json($topLevelDepartments);
    }

    /**
     * ② 特定の部署ID ($parentId) にぶら下がる子部署一覧の取得
     */
    public function children($parentId)
    {
        // departments_relation から parent_department_id = $parentId の child_department_id を取得
        $childIds = DepartmentRelation::where('parent_department_id', $parentId)
            ->pluck('child_department_id');

        // departments から上記 childIds に該当するレコードを取得
        $children = Department::whereIn('id', $childIds)->get();

        return response()->json($children);
    }

    /**
     * ③ (オプション) リレーションを直接使って子部署を取得する例
     */
    public function childrenUsingRelation($parentId)
    {
        // 例：Department モデル側で定義した children() リレーションを使うと、
        // Department::find($parentId)->children によって子部署一覧が取れる。
        $parentDepartment = Department::find($parentId);
        if (!$parentDepartment) {
            return response()->json(["error" => "Department not found"], 404);
        }
        $children = $parentDepartment->children;
        return response()->json($children);
    }
}
