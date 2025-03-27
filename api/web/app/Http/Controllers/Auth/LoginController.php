<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\AdminIdentity;
use App\Models\StaffIdentity;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // 管理者アカウントのチェック
        $admin = AdminIdentity::where('mail_address', $request->email)->first();
        if ($admin && Hash::check($request->password, $admin->password_hash)) {
            // 管理者としてログイン成功
            return response()->json([
                'success' => true,
                'token' => 'admin_token_' . time(), // 実際の実装ではSanctumなどで適切なトークンを生成する
                'user' => [
                    'email' => $admin->mail_address,
                    'role' => 'admin',
                    'first_login' => false
                ]
            ]);
        }

        // スタッフアカウントのチェック
        $staff = StaffIdentity::where('mail_address', $request->email)->first();
        if ($staff && Hash::check($request->password, $staff->password_hash)) {
            // スタッフの種類に応じてユーザータイプを決定
            $role = 'staff';

            if ($staff->is_personnel) {
                $role = 'personnel';
            } elseif ($staff->is_manager) {
                $role = 'manager';
            }

            return response()->json([
                'success' => true,
                'token' => $role . '_token_' . time(), // 実際の実装ではSanctumなどで適切なトークンを生成する
                'user' => [
                    'email' => $staff->mail_address,
                    'role' => $role,
                    'first_login' => false
                ]
            ]);
        }

        // ログイン失敗
        return response()->json([
            'success' => false,
            'message' => 'メールアドレスまたはパスワードが正しくありません'
        ], 401);
    }
    // CSRF保護なしのログイン（開発用）
    public function loginNoCsrf(Request $request)
    {
        // 同じログイン処理を実装
        return $this->login($request);
    }
}
