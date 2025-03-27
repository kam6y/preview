<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class MeasuresCommentSeeder extends Seeder
{
    /**
     * 施策コメントデータのシード
     */
    public function run(): void
    {
        $now = Carbon::now();
        $comments = [];
        
        // コメントテンプレート
        $commentTemplates = [
            // 管理者からのコメント
            'admin' => [
                '施策の進捗状況を教えてください。',
                'この施策は全社的に重要です。優先的に進めてください。',
                '同様の施策を他部門でも展開できると良いですね。',
                '期限が迫っていますが、進捗はいかがですか？',
                '素晴らしい施策ですね。他部門への展開も検討しましょう。',
            ],
            // スタッフからのコメント
            'staff' => [
                '現在、計画通りに進行中です。来週には最初の結果が出る予定です。',
                '一部スケジュールに遅れが生じていますが、対策を検討中です。',
                '予想以上に効果が出ています。詳細なレポートを来週共有します。',
                'チームメンバー全員がこの施策に取り組んでいます。',
                '予定通り進んでいますが、追加リソースがあると助かります。',
                '先週のミーティングでの提案を反映させました。結果も良好です。',
                '他部門との連携が必要ですが、調整に時間がかかっています。',
                '初期結果は良好です。このまま継続します。',
                '目標達成に向けて順調に進んでいます。',
                '予想外の課題が発生しましたが、解決策を実行中です。',
            ],
            // 人事からのコメント
            'personnel' => [
                '人事部としてサポートできることがあればお知らせください。',
                '研修プログラムの開発が必要であれば協力します。',
                'この施策は社員エンゲージメント向上に寄与すると思います。',
                '社内コミュニケーションの観点からもサポートします。',
                '人材配置の調整が必要であれば相談してください。',
            ],
        ];
        
        // 全ての施策に対してコメントを生成
        $measures = DB::table('measures')->get();
        
        // 管理者情報
        $admins = DB::table('admin_identity')->get();
        
        // スタッフ情報
        $staffs = DB::table('staff_identity')->get();
        
        foreach ($measures as $measure) {
            // コメント数（0～5）
            $commentCount = rand(0, 5);
            
            // 施策の作成日
            $measureCreatedAt = Carbon::parse($measure->created_at);
            
            for ($i = 0; $i < $commentCount; $i++) {
                // コメントの作成日（施策作成日から現在までの間）
                $commentCreatedAt = Carbon::createFromTimestamp(
                    rand($measureCreatedAt->timestamp, $now->timestamp)
                );
                
                // コメント種別をランダムに選択
                $commentType = array_rand($commentTemplates);
                
                // コメント内容をランダムに選択
                $commentText = $commentTemplates[$commentType][array_rand($commentTemplates[$commentType])];
                
                // コメント作成者情報
                $adminId = null;
                $staffId = null;
                $mention_is_personnel = false;
                $mention_is_admin = false;
                $mention_is_manager = false;
                
                if ($commentType === 'admin') {
                    // 管理者からのコメント
                    $adminId = $admins->random()->id;
                    
                    // メンション先をランダムに決定
                    $mentionType = array_rand(['personnel', 'manager', 'none']);
                    if ($mentionType === 'personnel') {
                        $mention_is_personnel = true;
                    } elseif ($mentionType === 'manager') {
                        $mention_is_manager = true;
                    }
                } elseif ($commentType === 'personnel') {
                    // 人事からのコメント
                    $personnelStaff = $staffs->where('is_personnel', true)
                                            ->where('tenant_id', $measure->tenant_id)
                                            ->first();
                    
                    if ($personnelStaff) {
                        $staffId = $personnelStaff->id;
                        
                        // メンション先（管理者または管理職）
                        $mention_is_admin = rand(0, 1) === 1;
                        $mention_is_manager = !$mention_is_admin;
                    } else {
                        // 該当する人事スタッフがいなければ、一般スタッフからのコメントとする
                        $commentType = 'staff';
                        $staffId = $staffs->where('tenant_id', $measure->tenant_id)
                                         ->where('department_id', $measure->department_id)
                                         ->random()->id;
                    }
                } else {
                    // スタッフからのコメント
                    $departmentStaffs = $staffs->where('tenant_id', $measure->tenant_id)
                                             ->where('department_id', $measure->department_id);
                    
                    if ($departmentStaffs->count() > 0) {
                        $staffId = $departmentStaffs->random()->id;
                        
                        // メンション先（管理者、人事、管理職のいずれか）
                        $mentionType = array_rand(['admin', 'personnel', 'manager', 'none']);
                        if ($mentionType === 'admin') {
                            $mention_is_admin = true;
                        } elseif ($mentionType === 'personnel') {
                            $mention_is_personnel = true;
                        } elseif ($mentionType === 'manager') {
                            $mention_is_manager = true;
                        }
                    }
                }
                
                if ($adminId !== null || $staffId !== null) {
                    $comments[] = [
                        'measure_id' => $measure->id,
                        'admin_id' => $adminId,
                        'staff_id' => $staffId,
                        'comment_text' => $commentText,
                        'mention_is_personnel' => $mention_is_personnel,
                        'mention_is_admin' => $mention_is_admin,
                        'mention_is_manager' => $mention_is_manager,
                        'created_at' => $commentCreatedAt,
                        'updated_at' => $commentCreatedAt,
                    ];
                }
            }
        }
        
        DB::table('measures_comments')->insert($comments);
    }
}