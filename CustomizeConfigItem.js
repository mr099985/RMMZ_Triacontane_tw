//=============================================================================
// CustomizeConfigItem.js
// ----------------------------------------------------------------------------
// (C) 2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 3.1.0 2020/08/20 スイッチ項目でONとOFFの表示文字列を変更できる機能を追加
// 3.0.0 2020/08/20 MZで動作するよう全面的に修正
// 2.1.0 2017/12/15 追加項目のデフォルト項目を含めた並び順を自由に設定できる機能を追加
//                  項目名称を日本語化
// 2.0.1 2017/10/15 2.0.0の修正によりスイッチ項目を有効にしたときにゲーム開始するとエラーになる問題を修正
// 2.0.0 2017/09/10 ツクールの型指定機能に対応し、各オプション項目を任意の数だけ追加できる機能を追加
// 1.2.3 2017/06/08 1.2.2の修正により起動できなくなっていた問題を修正
// 1.2.2 2017/05/27 競合の可能性のある記述（Objectクラスへのプロパティ追加）をリファクタリング
// 1.2.1 2016/12/08 1.2.0の機能追加以降、デフォルト項目で決定ボタンを押すとエラーになっていた現象を修正
// 1.2.0 2016/12/02 各項目で決定ボタンを押したときに実行されるスクリプトを設定できる機能を追加
// 1.1.1 2016/08/14 スイッチ項目、音量項目の初期値が無効になっていた問題を修正
// 1.1.0 2016/04/29 項目をクリックしたときに項目値が循環するよう修正
// 1.0.0 2016/01/17 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc [ ver.3.1.0 ]系統選項畫面追加任意項目
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/CustomizeConfigItem.js
 * @author トリアコンタン(翻譯:ReIris)
 * @base PluginCommonBase
 *
 * @param NumberOptions
 * @text 數值項目
 * @desc 追加數值項目的設定。
 * @default
 * @type struct<NumberData>[]
 *
 * @param StringOptions
 * @text 文字項目
 * @desc 追加文字項目的設定。
 * @default
 * @type struct<StringData>[]
 *
 * @param SwitchOptions
 * @text 開關項目
 * @desc 追加開關項目的設定。
 * @default
 * @type struct<BooleanData>[]
 *
 * @param VolumeOptions
 * @text 音量項目
 * @desc 追加音量項目的設定。
 * @default
 * @type struct<VolumeData>[]
 *
 * @command UNLOCK
 * @text 取消隱藏系統選項
 * @desc 取消隱藏指定的系統選項。
 *
 * @arg name
 * @text 項目名稱
 * @desc 指定的項目名稱。
 * @default
 *
 * @help 系統選項畫面中追加任意項目。
 * 項目的種類為以下四種。
 * 不需要的項目請設置為空白。
 *
 * ・開關項目：
 * 可選擇開關項目。指定編號 ID 的開關與值會將會同步。
 * 如果在系統選項畫面設定值，會直接反應在開關上，如果變更開關
 * 同時也會反應在系統選項畫面中。
 * 另外，項目的值在檔案之間為共享數值。
 * 如果設定隱藏項目，將不會在系統選項畫面中顯示。
 * 除非您繼續遊戲，否則它可用於不顯示的項目。
 * 隱藏項目可以使用插件命令中顯示。
 *
 * 腳本為進階使用。
 * 當光標放在目標上，然後按確定。
 * 將執行指定的 JavaScript 。
 * 主要用於專用設定畫面的轉換等等。
 *
 * ・數值項目：
 * 可選擇調整數值的項目。指定的變數 ID 與值將會同步。
 * 除了在開關項中指定的內容、
 * 也要指定最小值和最大值以及一個輸入更改的變數。
 *
 * ・音量項目：
 * 可選擇調整音量的項目。
 * 可將其用於每個角色的音量，其項目與 BGM 音量等等相同。
 *
 * ・文字項目：
 * 可選擇調整文字的項目。
 * 指定項目的文字內容數組並可以選擇。
 * 設定選擇的文字順序索引(起始為 0 )的變數值。
 * 其中要設定為預設值的是索引值。
 *
 * 插件命令
 *  從事件命令中「插件命令」執行。
 *  （參數之間使用半形空格區分）
 *
 *  CC_UNLOCK [項目名]
 *  　指定隱藏項目解除隱藏
 *  範例：CC_UNLOCK 數值項目 1
 *
 * 利用規約：
 *  不需要作者許可，可以進行修改和二次發布。
 *  使用形式（商業用途，18禁使用等）沒有限制。
 */

/*~struct~NumberData:
 * @param Name
 * @text 項目名稱
 * @desc 設定數值項目的名稱。
 * @default 數值項目 1
 *
 * @param DefaultValue
 * @text 預設值
 * @desc 此項目的初期預設值。
 * @default 0
 * @type number
 *
 * @param VariableID
 * @text 變數 ID
 * @desc 此項目中使用的變數 ID。
 * @default 0
 * @type variable
 *
 * @param HiddenFlag
 * @text 是否隱藏項目
 * @desc 項目是否預設隱藏。
 * 執行插件命令可以使此項目顯示。
 * @default false
 * @type boolean
 *
 * @param Script
 * @text 腳本
 * @desc 確定選擇項目時執行此腳本。
 * @default
 *
 * @param NumberMin
 * @text 最小値
 * @desc 項目的最小值。
 * @default 0
 * @type number
 *
 * @param NumberMax
 * @text 最大値
 * @desc 項目的最大值。
 * @default 100
 * @type number
 *
 * @param NumberStep
 * @text 變化量
 * @desc 操作此項目數值變化的量。
 * @default 20
 * @type number
 *
 * @param AddPosition
 * @text 追加位置
 * @desc 項目追加的位置。於指定項目上方追加。
 * @default
 * @type select
 * @option 底部
 * @value
 * @option 始終衝刺
 * @value alwaysDash
 * @option 記憶命令
 * @value commandRemember
 * @option 點擊介面
 * @value touchUI
 * @option BGM 音量
 * @value bgmVolume
 * @option BGS 音量
 * @value bgsVolume
 * @option ME 音量
 * @value meVolume
 * @option SE 音量
 * @value seVolume
 */
/*~struct~BooleanData:
 * @param Name
 * @text 項目名稱
 * @desc 設定開關項目的名稱。
 * @default 開關項目 1
 *
 * @param DefaultValue
 * @text 預設值
 * @desc 此項目的初期預設值。
 * @default false
 * @type boolean
 *
 * @param SwitchID
 * @text 開關ID
 * @desc 此項目中使用的開關 ID。
 * @default 0
 * @type switch
 *
 * @param OnText
 * @text ON 文字
 * @desc 當開關為 ON 時，選項視窗中顯示的文本。
 * 如果省略，則顯示 ON。
 * @default
 *
 * @param OffText
 * @text OFF 文字
 * @desc 當開關為 OFF 時，選項視窗中顯示的文本。
 * 如果省略，則顯示 OFF。
 * @default
 *
 * @param HiddenFlag
 * @text 是否隱藏項目
 * @desc 項目是否預設隱藏。執行插件命令可以使此項目顯示。
 * @default false
 * @type boolean
 *
 * @param Script
 * @text 腳本
 * @desc 確定選擇項目時執行此腳本。
 * @default
 *
 * @param AddPosition
 * @text 追加位置
 * @desc 項目追加的位置。於指定項目上方追加。
 * @default
 * @type select
 * @option 底部
 * @value
 * @option 始終衝刺
 * @value alwaysDash
 * @option 記憶命令
 * @value commandRemember
 * @option 點擊介面
 * @value touchUI
 * @option BGM 音量
 * @value bgmVolume
 * @option BGS 音量
 * @value bgsVolume
 * @option ME 音量
 * @value meVolume
 * @option SE 音量
 * @value seVolume
 */
/*~struct~StringData:
 * @param Name
 * @text 項目名稱
 * @desc 設定文字項目的名稱。
 * @default 文字項目 1
 *
 * @param DefaultValue
 * @text 預設值
 * @desc 此項目的初期預設值。
 * 指定索引數值。(起始為 0 )
 * @default 0
 * @type number
 *
 * @param VariableID
 * @text 變數ID
 * @desc 此項目中使用的變數 ID。
 * @default 0
 * @type variable
 *
 * @param HiddenFlag
 * @text 是否隱藏項目
 * @desc 項目是否預設隱藏。執行插件命令可以使此項目顯示。
 * @default false
 * @type boolean
 *
 * @param Script
 * @text 腳本
 * @desc 確定選擇項目時執行此腳本。
 * @default
 *
 * @param StringItems
 * @text 內容數組
 * @desc 項目的設定內容的數組。
 * @default
 * @type string[]
 *
 * @param AddPosition
 * @text 追加位置
 * @desc 項目追加的位置。於指定項目上方追加。
 * @default
 * @type select
 * @option 底部
 * @value
 * @option 始終衝刺
 * @value alwaysDash
 * @option 記憶命令
 * @value commandRemember
 * @option 點擊介面
 * @value touchUI
 * @option BGM 音量
 * @value bgmVolume
 * @option BGS 音量
 * @value bgsVolume
 * @option ME 音量
 * @value meVolume
 * @option SE 音量
 * @value seVolume
 */
/*~struct~VolumeData:
 * @param Name
 * @text 項目名稱
 * @desc 設定音量項目的名稱。
 * @default 音量項目 1
 *
 * @param DefaultValue
 * @text 預設值
 * @desc 此項目的初期預設值。
 * @default 0
 * @type number
 *
 * @param VariableID
 * @text 變數ID
 * @desc 此項目中使用的變數 ID。
 * @default 0
 * @type variable
 *
 * @param HiddenFlag
 * @text 是否隱藏項目
 * @desc 項目是否預設隱藏。執行插件命令可以使此項目顯示。
 * @default false
 * @type boolean
 *
 * @param Script
 * @text 腳本
 * @desc 確定選擇項目時執行此腳本。
 * @default
 *
 * @param AddPosition
 * @text 追加位置
 * @desc 項目追加的位置。於指定項目上方追加。
 * @default
 * @type select
 * @option 底部
 * @value
 * @option 始終衝刺
 * @value alwaysDash
 * @option 記憶命令
 * @value commandRemember
 * @option 點擊介面
 * @value touchUI
 * @option BGM 音量
 * @value bgmVolume
 * @option BGS 音量
 * @value bgsVolume
 * @option ME 音量
 * @value meVolume
 * @option SE 音量
 * @value seVolume
 */

(function() {
    'use strict';
    var script = document.currentScript;

    PluginManagerEx.registerCommand(script, 'UNLOCK', function(args) {
        ConfigManager.customParamUnlock(args.name);
    });

    var iterate = function(that, handler) {
        Object.keys(that).forEach(function(key, index) {
            handler.call(that, key, that[key], index);
        });
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var param = PluginManagerEx.createParameter(script);
    if (!param.NumberOptions) {
        param.NumberOptions = [];
    }
    if (!param.StringOptions) {
        param.StringOptions = [];
    }
    if (!param.SwitchOptions) {
        param.SwitchOptions = [];
    }
    if (!param.VolumeOptions) {
        param.VolumeOptions = [];
    }

    var localOptionWindowIndex = 0;

    //=============================================================================
    // ConfigManager
    //  追加項目の設定値や初期値を管理します。
    //=============================================================================
    ConfigManager.customParams   = null;
    ConfigManager.hiddenInfo     = {};
    ConfigManager._symbolNumber  = 'Number';
    ConfigManager._symbolBoolean = 'Boolean';
    ConfigManager._symbolString  = 'String';
    ConfigManager._symbolVolume  = 'Volume';

    ConfigManager.getCustomParams = function() {
        if (this.customParams) {
            return this.customParams;
        }
        this.customParams = {};
        param.NumberOptions.forEach(function(optionItem, index) {
            this.makeNumberOption(optionItem, index);
        }, this);
        param.StringOptions.forEach(function(optionItem, index) {
            this.makeStringOption(optionItem, index);
        }, this);
        param.SwitchOptions.forEach(function(optionItem, index) {
            this.makeSwitchOption(optionItem, index);
        }, this);
        param.VolumeOptions.forEach(function(optionItem, index) {
            this.makeVolumeOption(optionItem, index);
        }, this);
        return this.customParams;
    };

    ConfigManager.makeNumberOption = function(optionItem, index) {
        var data    = this.makeCommonOption(optionItem, index, this._symbolNumber);
        data.min    = optionItem.NumberMin;
        data.max    = optionItem.NumberMax;
        data.offset = optionItem.NumberStep;
        this.pushOptionData(data);
    };

    ConfigManager.makeStringOption = function(optionItem, index) {
        var data    = this.makeCommonOption(optionItem, index, this._symbolString);
        data.values = optionItem.StringItems || ['no item'];
        data.min    = 0;
        data.max    = data.values.length - 1;
        this.pushOptionData(data);
    };

    ConfigManager.makeSwitchOption = function(optionItem, index) {
        var data       = this.makeCommonOption(optionItem, index, this._symbolBoolean);
        data.variable  = optionItem.SwitchID;
        data.onText    = optionItem.OnText;
        data.offText   = optionItem.OffText;
        this.pushOptionData(data);
    };

    ConfigManager.makeVolumeOption = function(optionItem, index) {
        var data = this.makeCommonOption(optionItem, index, this._symbolVolume);
        this.pushOptionData(data);
    };

    ConfigManager.makeCommonOption = function(optionItem, index, type) {
        var data       = {};
        data.symbol    = `${type}${index + 1}`;
        data.name      = optionItem.Name;
        data.hidden    = optionItem.HiddenFlag;
        data.script    = optionItem.Script;
        data.initValue = optionItem.DefaultValue;
        data.variable  = optionItem.VariableID || 0;
        data.addPotion = optionItem.AddPosition;
        return data;
    };

    ConfigManager.pushOptionData = function(data) {
        this.customParams[data.symbol] = data;
    };

    var _ConfigManager_makeData = ConfigManager.makeData;
    ConfigManager.makeData      = function() {
        var config        = _ConfigManager_makeData.apply(this, arguments);
        config.hiddenInfo = {};
        iterate(this.getCustomParams(), function(symbol) {
            config[symbol]            = this[symbol];
            config.hiddenInfo[symbol] = this.hiddenInfo[symbol];
        }.bind(this));
        return config;
    };

    var _ConfigManager_load = ConfigManager.load;
    ConfigManager.load = function() {
        this.applyData({});
        _ConfigManager_load.apply(this, arguments);
    };

    var _ConfigManager_applyData = ConfigManager.applyData;
    ConfigManager.applyData      = function(config) {
        _ConfigManager_applyData.apply(this, arguments);
        iterate(this.getCustomParams(), function(symbol, item) {
            if (symbol.contains(this._symbolBoolean)) {
                this[symbol] = this.readFlagCustom(config, symbol, item);
            } else if (symbol.contains(this._symbolVolume)) {
                this[symbol] = this.readVolumeCustom(config, symbol, item);
            } else {
                this[symbol] = this.readOther(config, symbol, item);
            }
            this.hiddenInfo[symbol] = (config.hiddenInfo ? config.hiddenInfo[symbol] : item.hidden);
        }.bind(this));
    };

    ConfigManager.customParamUnlock = function(name) {
        iterate(this.getCustomParams(), function(symbol, item) {
            if (item.name === name) this.hiddenInfo[symbol] = false;
        }.bind(this));
        this.save();
    };

    ConfigManager.readOther = function(config, name, item) {
        var value = config[name];
        if (value !== undefined) {
            return Number(value).clamp(item.min, item.max);
        } else {
            return item.initValue;
        }
    };

    ConfigManager.readFlagCustom = function(config, name, item) {
        if (config[name] !== undefined) {
            return this.readFlag(config, name);
        } else {
            return item.initValue;
        }
    };

    ConfigManager.readVolumeCustom = function(config, name, item) {
        if (config[name] !== undefined) {
            return this.readVolume(config, name);
        } else {
            return item.initValue;
        }
    };

    ConfigManager.exportCustomParams = function() {
        if (!$gameVariables || !$gameSwitches) return;
        iterate(this.getCustomParams(), function(symbol, item) {
            if (item.variable > 0) {
                if (symbol.contains(this._symbolBoolean)) {
                    $gameSwitches.setValue(item.variable, !!this[symbol]);
                } else {
                    $gameVariables.setValue(item.variable, this[symbol]);
                }
            }
        }.bind(this));
    };

    ConfigManager.importCustomParams = function() {
        if (!$gameVariables || !$gameSwitches) return;
        iterate(this.getCustomParams(), function(symbol, item) {
            if (item.variable > 0) {
                if (symbol.contains(this._symbolBoolean)) {
                    this[symbol] = $gameSwitches.value(item.variable);
                } else if (symbol.contains(this._symbolVolume)) {
                    this[symbol] = $gameVariables.value(item.variable).clamp(0, 100);
                } else {
                    this[symbol] = $gameVariables.value(item.variable).clamp(item.min, item.max);
                }
            }
        }.bind(this));
    };

    var _ConfigManager_save = ConfigManager.save;
    ConfigManager.save      = function() {
        _ConfigManager_save.apply(this, arguments);
        this.exportCustomParams();
    };

    //=============================================================================
    // Game_Map
    //  リフレッシュ時にオプション値を同期します。
    //=============================================================================
    var _Game_Map_refresh      = Game_Map.prototype.refresh;
    Game_Map.prototype.refresh = function() {
        _Game_Map_refresh.apply(this, arguments);
        ConfigManager.importCustomParams();
    };

    //=============================================================================
    // DataManager
    //  セーブ時とロード時にオプション値を同期します。
    //=============================================================================
    var _DataManager_setupNewGame = DataManager.setupNewGame;
    DataManager.setupNewGame      = function() {
        _DataManager_setupNewGame.apply(this, arguments);
        ConfigManager.exportCustomParams();
    };

    var _DataManager_loadGameWithoutRescue = DataManager.loadGameWithoutRescue;
    DataManager.loadGameWithoutRescue      = function(savefileId) {
        var result = _DataManager_loadGameWithoutRescue.apply(this, arguments);
        ConfigManager.exportCustomParams();
        return result;
    };

    var _Scene_Options_maxCommands = Scene_Options.prototype.maxCommands;
    Scene_Options.prototype.maxCommands = function() {
        return _Scene_Options_maxCommands.apply(this, arguments) +
            param.NumberOptions.length + param.StringOptions.length +
            param.SwitchOptions.length + param.VolumeOptions.length;
    };

    //=============================================================================
    // Window_Options
    //  追加項目を描画します。
    //=============================================================================
    var _Window_Options_initialize      = Window_Options.prototype.initialize;
    Window_Options.prototype.initialize = function() {
        this._customParams = ConfigManager.getCustomParams();
        _Window_Options_initialize.apply(this, arguments);
        this.select(localOptionWindowIndex);
        localOptionWindowIndex = 0;
    };

    var _Window_Options_makeCommandList      = Window_Options.prototype.makeCommandList;
    Window_Options.prototype.makeCommandList = function() {
        _Window_Options_makeCommandList.apply(this, arguments);
        this.addCustomOptions();
    };

    Window_Options.prototype.addCustomOptions = function() {
        iterate(this._customParams, function(key, item) {
            if (!ConfigManager.hiddenInfo[key]) {
                this.addCommand(item.name, key);
                if (item.addPotion) {
                    this.shiftCustomOptions(item.addPotion);
                }
            }
        }.bind(this));
    };

    Window_Options.prototype.shiftCustomOptions = function(addPotion) {
        var targetCommand = this._list.filter(function(command) {
            return command.symbol === addPotion;
        })[0];
        if (!targetCommand) {
            return;
        }
        var targetIndex = this._list.indexOf(targetCommand);
        var newCommand = this._list.pop();
        this._list.splice(targetIndex, 0, newCommand);
    };

    var _Window_Options_statusText      = Window_Options.prototype.statusText;
    Window_Options.prototype.statusText = function(index) {
        var result = _Window_Options_statusText.apply(this, arguments);
        var symbol = this.commandSymbol(index);
        var value  = this.getConfigValue(symbol);
        if (this.isNumberSymbol(symbol)) {
            result = this.numberStatusText(value);
        } else if (this.isStringSymbol(symbol)) {
            result = this.stringStatusText(value, symbol);
        } else if (this.isBooleanSymbol(symbol)) {
            result = this.booleanCustomStatusText(value, symbol);
        }
        return result;
    };

    Window_Options.prototype.isNumberSymbol = function(symbol) {
        return symbol.contains(ConfigManager._symbolNumber);
    };

    Window_Options.prototype.isStringSymbol = function(symbol) {
        return symbol.contains(ConfigManager._symbolString);
    };

    Window_Options.prototype.isBooleanSymbol = function(symbol) {
        return symbol.contains(ConfigManager._symbolBoolean);
    };

    Window_Options.prototype.isCustomSymbol = function(symbol) {
        return !!this._customParams[symbol];
    };

    Window_Options.prototype.numberStatusText = function(value) {
        return value;
    };

    Window_Options.prototype.stringStatusText = function(value, symbol) {
        return this._customParams[symbol].values[value];
    };

    Window_Options.prototype.booleanCustomStatusText = function(value, symbol) {
        var data = this._customParams[symbol];
        var property = value ? 'onText' : 'offText';
        if (data && data[property]) {
            return data[property];
        } else {
            return this.booleanStatusText(value);
        }
    };

    var _Window_Options_processOk      = Window_Options.prototype.processOk;
    Window_Options.prototype.processOk = function() {
        if (!this._shiftValue(1, true)) _Window_Options_processOk.apply(this, arguments);
        this.execScript();
    };

    var _Window_Options_cursorRight      = Window_Options.prototype.cursorRight;
    Window_Options.prototype.cursorRight = function(wrap) {
        if (!this._shiftValue(1, false)) _Window_Options_cursorRight.apply(this, arguments);
    };

    var _Window_Options_cursorLeft      = Window_Options.prototype.cursorLeft;
    Window_Options.prototype.cursorLeft = function(wrap) {
        if (!this._shiftValue(-1, false)) _Window_Options_cursorLeft.apply(this, arguments);
    };

    Window_Options.prototype._shiftValue = function(sign, loopFlg) {
        var symbol = this.commandSymbol(this.index());
        var value  = this.getConfigValue(symbol);
        if (this.isNumberSymbol(symbol)) {
            value += this.numberOffset(symbol) * sign;
            this.changeValue(symbol, this._clampValue(value, symbol, loopFlg));
            return true;
        }
        if (this.isStringSymbol(symbol)) {
            value += sign;
            this.changeValue(symbol, this._clampValue(value, symbol, loopFlg));
            return true;
        }
        return false;
    };

    Window_Options.prototype.execScript = function() {
        var symbol = this.commandSymbol(this.index());
        if (!this.isCustomSymbol(symbol)) return;
        var script = this._customParams[symbol].script;
        if (script) eval(script);
        localOptionWindowIndex = this.index();
    };

    Window_Options.prototype._clampValue = function(value, symbol, loopFlg) {
        var maxValue = this._customParams[symbol].max;
        var minValue = this._customParams[symbol].min;
        if (loopFlg) {
            if (value > maxValue) value = minValue;
            if (value < minValue) value = maxValue;
        }
        return value.clamp(this._customParams[symbol].min, this._customParams[symbol].max);
    };

    Window_Options.prototype.numberOffset = function(symbol) {
        var value = this._customParams[symbol].offset;
        if (Input.isPressed('shift')) value *= 10;
        return value;
    };

    Window_Options.prototype.windowHeight = function() {
        return this.fittingHeight(Math.min(this.numVisibleRows(), 14));
    };
})();

