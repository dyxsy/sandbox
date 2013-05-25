class CreatePowerBits < ActiveRecord::Migration
  def change
    create_table :power_bits do |t|
      t.string  :group       # 组名
      t.string  :action      # 动作名称(英文)
      t.string  :text        # 名称
      t.timestamps
    end
  end
end