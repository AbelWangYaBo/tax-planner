/* ============================================================================
 * cities.js — 社保 / 住房公积金 缴费基数数据（自动生成，请勿手改）
 * ----------------------------------------------------------------------------
 * 由 collector/build-cities.js 依据 data/dataset.json 生成。
 * 数据模型是「生效时间段」，这里压成引擎需要的两段：
 *   social: [调整前下限, 调整前上限, 调整后下限, 调整后上限, 调整月份]
 *   housing[城市]: [前下限, 前上限, 后下限, 后上限, 月份]
 *   housingRates[城市]: [比例下限, 比例上限]
 *
 * 每个省/城市还带 meta：status(official|legacy|missing)、文号、原文 URL、
 * 抓取时间与历史时间段，页面据此标注「官方核验」还是「沿用旧口径」。
 *
 * 覆盖：31 个省级行政区 / 338 个地级行政区
 * 官方核验：公积金 11 城，社保 3 省
 * 数据时间：2026-11-23T11:52:04.111Z
 * ==========================================================================*/
(function (root) {
  'use strict';

  const DATA = {
  "socialYear": 2026,
  "prevYear": 2025,
  "verifiedAt": "2026-11",
  "dataUpdatedAt": "2026-11-23T11:52:04.111Z",
  "official": {
    "housing": 11,
    "social": 3,
    "note": "official = 已从地方政务站原文抽取并核验；legacy = 尚未核验的历史口径，界面会提示"
  },
  "provinces": [
    {
      "name": "北京市",
      "social": [
        7162,
        35811,
        7270,
        36348,
        7
      ],
      "socialMeta": {
        "status": "official",
        "checkedAt": "2026-11-23T11:47:05.786Z",
        "from": "2026-07-01",
        "to": "2027-06-30",
        "basisYear": 2025,
        "prevMissing": false,
        "doc": "京人社发〔2026〕7号",
        "source": "https://rsj.beijing.gov.cn/xxgk/2024zcwj/202608/t20260821_4831461.html",
        "title": "关于2026年度各项社会保险缴费工资基数上下限的通告 字体大小: 大 中 小 分享 京人社发",
        "via": "http",
        "segments": [
          {
            "from": "2025-07-01",
            "to": "2026-06-30",
            "min": 7162,
            "max": 35811,
            "status": "verified"
          },
          {
            "from": "2026-07-01",
            "to": "2027-06-30",
            "min": 7270,
            "max": 36348,
            "status": "verified"
          }
        ]
      },
      "cities": [
        {
          "id": "北京",
          "name": "北京",
          "province": "北京市",
          "social": {
            "prev": {
              "min": 7162,
              "max": 35811
            },
            "curr": {
              "min": 7270,
              "max": 36348
            },
            "adjustMonth": 7,
            "meta": {
              "status": "official",
              "checkedAt": "2026-11-23T11:47:05.786Z",
              "from": "2026-07-01",
              "to": "2027-06-30",
              "basisYear": 2025,
              "prevMissing": false,
              "doc": "京人社发〔2026〕7号",
              "source": "https://rsj.beijing.gov.cn/xxgk/2024zcwj/202608/t20260821_4831461.html",
              "title": "关于2026年度各项社会保险缴费工资基数上下限的通告 字体大小: 大 中 小 分享 京人社发",
              "via": "http",
              "segments": [
                {
                  "from": "2025-07-01",
                  "to": "2026-06-30",
                  "min": 7162,
                  "max": 35811,
                  "status": "verified"
                },
                {
                  "from": "2026-07-01",
                  "to": "2027-06-30",
                  "min": 7270,
                  "max": 36348,
                  "status": "verified"
                }
              ]
            },
            "segments": [
              {
                "from": "2025-07-01",
                "to": "2026-06-30",
                "min": 7162,
                "max": 35811,
                "status": "verified"
              },
              {
                "from": "2026-07-01",
                "to": "2027-06-30",
                "min": 7270,
                "max": 36348,
                "status": "verified"
              }
            ]
          },
          "housing": {
            "prev": {
              "min": 2540,
              "max": 35811
            },
            "curr": {
              "min": 2540,
              "max": 36348
            },
            "adjustMonth": 7,
            "note": "",
            "meta": {
              "status": "official",
              "checkedAt": "2026-11-23T11:41:19.378Z",
              "from": "2026-07-01",
              "to": "2027-06-30",
              "basisYear": 2025,
              "prevMissing": false,
              "doc": "京房公积金管委会办〔2026〕6号",
              "source": "https://gjj.beijing.gov.cn/web/zwgk61/2024zcwj/436433461/744103382/index.html",
              "title": "主题分类: 城乡建设(含住房) 文件有效性: 现行有效 制发单位: 北京住房公积金管理委员会",
              "via": "http",
              "segments": [
                {
                  "from": "2025-07-01",
                  "to": "2026-06-30",
                  "min": 2540,
                  "max": 35811,
                  "status": "verified"
                },
                {
                  "from": "2026-07-01",
                  "to": "2027-06-30",
                  "min": 2540,
                  "max": 36348,
                  "status": "verified"
                }
              ]
            },
            "segments": [
              {
                "from": "2025-07-01",
                "to": "2026-06-30",
                "min": 2540,
                "max": 35811,
                "status": "verified"
              },
              {
                "from": "2026-07-01",
                "to": "2027-06-30",
                "min": 2540,
                "max": 36348,
                "status": "verified"
              }
            ]
          },
          "housingRates": [
            0.05,
            0.12
          ],
          "lat": 39.9042,
          "lng": 116.4074
        }
      ]
    },
    {
      "name": "上海市",
      "social": [
        7460,
        37302,
        7546,
        37731,
        7
      ],
      "socialMeta": {
        "status": "official",
        "checkedAt": "2026-11-23T11:42:17.888Z",
        "from": "2026-07-01",
        "to": "2027-06-30",
        "basisYear": 2025,
        "prevMissing": false,
        "doc": null,
        "source": "https://rsj.sh.gov.cn/tgsgg_17341/20260818/t0035_1443203.html",
        "title": "本区域包含新闻发布、政务公开、网上办事、便民服务、互动交流,请使用tab按钮切换浏览 网站首",
        "via": "cdp",
        "segments": [
          {
            "from": "2025-07-01",
            "to": "2026-06-30",
            "min": 7460,
            "max": 37302,
            "status": "verified"
          },
          {
            "from": "2026-07-01",
            "to": "2027-06-30",
            "min": 7546,
            "max": 37731,
            "status": "verified"
          }
        ]
      },
      "cities": [
        {
          "id": "上海",
          "name": "上海",
          "province": "上海市",
          "social": {
            "prev": {
              "min": 7460,
              "max": 37302
            },
            "curr": {
              "min": 7546,
              "max": 37731
            },
            "adjustMonth": 7,
            "meta": {
              "status": "official",
              "checkedAt": "2026-11-23T11:42:17.888Z",
              "from": "2026-07-01",
              "to": "2027-06-30",
              "basisYear": 2025,
              "prevMissing": false,
              "doc": null,
              "source": "https://rsj.sh.gov.cn/tgsgg_17341/20260818/t0035_1443203.html",
              "title": "本区域包含新闻发布、政务公开、网上办事、便民服务、互动交流,请使用tab按钮切换浏览 网站首",
              "via": "cdp",
              "segments": [
                {
                  "from": "2025-07-01",
                  "to": "2026-06-30",
                  "min": 7460,
                  "max": 37302,
                  "status": "verified"
                },
                {
                  "from": "2026-07-01",
                  "to": "2027-06-30",
                  "min": 7546,
                  "max": 37731,
                  "status": "verified"
                }
              ]
            },
            "segments": [
              {
                "from": "2025-07-01",
                "to": "2026-06-30",
                "min": 7460,
                "max": 37302,
                "status": "verified"
              },
              {
                "from": "2026-07-01",
                "to": "2027-06-30",
                "min": 7546,
                "max": 37731,
                "status": "verified"
              }
            ]
          },
          "housing": {
            "prev": {
              "min": 2690,
              "max": 37302
            },
            "curr": {
              "min": 2740,
              "max": 37731
            },
            "adjustMonth": 7,
            "note": "",
            "meta": {
              "status": "official",
              "checkedAt": "2026-11-23T11:41:23.262Z",
              "from": "2026-07-01",
              "to": "2027-06-30",
              "basisYear": 2025,
              "prevMissing": false,
              "doc": "沪公积金管委会〔2026〕3号",
              "source": "https://www.shzfgjj.cn/html/newxxgk/zcwj/gfxwj/228478.html",
              "title": "关于2026年度上海市调整住房公积金缴存基数、比例以及月缴存额上下限的通知 文号:沪公积金管",
              "via": "http",
              "segments": [
                {
                  "from": "2025-07-01",
                  "to": "2026-06-30",
                  "min": 2690,
                  "max": 37302,
                  "status": "verified"
                },
                {
                  "from": "2026-07-01",
                  "to": "2027-06-30",
                  "min": 2740,
                  "max": 37731,
                  "status": "verified"
                }
              ]
            },
            "segments": [
              {
                "from": "2025-07-01",
                "to": "2026-06-30",
                "min": 2690,
                "max": 37302,
                "status": "verified"
              },
              {
                "from": "2026-07-01",
                "to": "2027-06-30",
                "min": 2740,
                "max": 37731,
                "status": "verified"
              }
            ]
          },
          "housingRates": [
            0.05,
            0.07
          ],
          "lat": 31.2304,
          "lng": 121.4737
        }
      ]
    },
    {
      "name": "天津市",
      "social": [
        5124,
        25620,
        5180,
        25902,
        9
      ],
      "socialMeta": {
        "status": "legacy",
        "checkedAt": null
      },
      "cities": [
        {
          "id": "天津",
          "name": "天津",
          "province": "天津市",
          "social": {
            "prev": {
              "min": 5124,
              "max": 25620
            },
            "curr": {
              "min": 5180,
              "max": 25902
            },
            "adjustMonth": 9,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": {
            "prev": {
              "min": 2510,
              "max": 28917
            },
            "curr": {
              "min": 2510,
              "max": 28917
            },
            "adjustMonth": 7,
            "note": "缺 2025 年度原文，1–6 月暂按 2026 年度基数计算",
            "meta": {
              "status": "official",
              "checkedAt": "2026-11-23T11:41:19.378Z",
              "from": "2026-07-01",
              "to": "2027-06-30",
              "basisYear": 2025,
              "prevMissing": true,
              "doc": "津公积金委〔2026〕3号",
              "source": "https://gk.tj.gov.cn/zcwjk/zfgjj/zcwj/202607/t20260717_7337480.html",
              "title": "天津政务网 2019年12月3日星期二 无障碍 简体 | 繁体 名 称 :关于调整2026年",
              "via": "http",
              "segments": [
                {
                  "from": "2026-07-01",
                  "to": "2027-06-30",
                  "min": 2510,
                  "max": 28917,
                  "status": "verified"
                }
              ]
            },
            "segments": [
              {
                "from": "2026-07-01",
                "to": "2027-06-30",
                "min": 2510,
                "max": 28917,
                "status": "verified"
              }
            ]
          },
          "housingRates": [
            0.05,
            0.12
          ],
          "lat": 39.3434,
          "lng": 117.3616
        }
      ]
    },
    {
      "name": "重庆市",
      "social": [
        4404,
        22017,
        4553,
        22765,
        1
      ],
      "socialMeta": {
        "status": "legacy",
        "checkedAt": null
      },
      "cities": [
        {
          "id": "重庆",
          "name": "重庆",
          "province": "重庆市",
          "social": {
            "prev": {
              "min": 4404,
              "max": 22017
            },
            "curr": {
              "min": 4553,
              "max": 22765
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": 29.563,
          "lng": 106.5516
        }
      ]
    },
    {
      "name": "河北省",
      "social": [
        4007,
        20034,
        4076,
        20382,
        7
      ],
      "socialMeta": {
        "status": "legacy",
        "checkedAt": null
      },
      "cities": [
        {
          "id": "石家庄",
          "name": "石家庄",
          "province": "河北省",
          "social": {
            "prev": {
              "min": 4007,
              "max": 20034
            },
            "curr": {
              "min": 4076,
              "max": 20382
            },
            "adjustMonth": 7,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": 38.0428,
          "lng": 114.5149
        },
        {
          "id": "唐山",
          "name": "唐山",
          "province": "河北省",
          "social": {
            "prev": {
              "min": 4007,
              "max": 20034
            },
            "curr": {
              "min": 4076,
              "max": 20382
            },
            "adjustMonth": 7,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "秦皇岛",
          "name": "秦皇岛",
          "province": "河北省",
          "social": {
            "prev": {
              "min": 4007,
              "max": 20034
            },
            "curr": {
              "min": 4076,
              "max": 20382
            },
            "adjustMonth": 7,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "邯郸",
          "name": "邯郸",
          "province": "河北省",
          "social": {
            "prev": {
              "min": 4007,
              "max": 20034
            },
            "curr": {
              "min": 4076,
              "max": 20382
            },
            "adjustMonth": 7,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "邢台",
          "name": "邢台",
          "province": "河北省",
          "social": {
            "prev": {
              "min": 4007,
              "max": 20034
            },
            "curr": {
              "min": 4076,
              "max": 20382
            },
            "adjustMonth": 7,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "保定",
          "name": "保定",
          "province": "河北省",
          "social": {
            "prev": {
              "min": 4007,
              "max": 20034
            },
            "curr": {
              "min": 4076,
              "max": 20382
            },
            "adjustMonth": 7,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "张家口",
          "name": "张家口",
          "province": "河北省",
          "social": {
            "prev": {
              "min": 4007,
              "max": 20034
            },
            "curr": {
              "min": 4076,
              "max": 20382
            },
            "adjustMonth": 7,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "承德",
          "name": "承德",
          "province": "河北省",
          "social": {
            "prev": {
              "min": 4007,
              "max": 20034
            },
            "curr": {
              "min": 4076,
              "max": 20382
            },
            "adjustMonth": 7,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "沧州",
          "name": "沧州",
          "province": "河北省",
          "social": {
            "prev": {
              "min": 4007,
              "max": 20034
            },
            "curr": {
              "min": 4076,
              "max": 20382
            },
            "adjustMonth": 7,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": {
            "prev": {
              "min": 2380,
              "max": 25581
            },
            "curr": {
              "min": 2380,
              "max": 25581
            },
            "adjustMonth": 7,
            "note": "",
            "meta": {
              "status": "legacy",
              "checkedAt": null,
              "note": ""
            },
            "segments": []
          },
          "housingRates": [
            0.05,
            0.12
          ],
          "lat": 38.3045,
          "lng": 116.8388
        },
        {
          "id": "廊坊",
          "name": "廊坊",
          "province": "河北省",
          "social": {
            "prev": {
              "min": 4007,
              "max": 20034
            },
            "curr": {
              "min": 4076,
              "max": 20382
            },
            "adjustMonth": 7,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "衡水",
          "name": "衡水",
          "province": "河北省",
          "social": {
            "prev": {
              "min": 4007,
              "max": 20034
            },
            "curr": {
              "min": 4076,
              "max": 20382
            },
            "adjustMonth": 7,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        }
      ]
    },
    {
      "name": "山西省",
      "social": [
        4198,
        20991,
        4244,
        21219,
        1
      ],
      "socialMeta": {
        "status": "legacy",
        "checkedAt": null
      },
      "cities": [
        {
          "id": "太原",
          "name": "太原",
          "province": "山西省",
          "social": {
            "prev": {
              "min": 4198,
              "max": 20991
            },
            "curr": {
              "min": 4244,
              "max": 21219
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": {
            "prev": {
              "min": 2150,
              "max": 29100
            },
            "curr": {
              "min": 2150,
              "max": 29100
            },
            "adjustMonth": 1,
            "note": "",
            "meta": {
              "status": "legacy",
              "checkedAt": null,
              "note": ""
            },
            "segments": []
          },
          "housingRates": [
            0.05,
            0.12
          ],
          "lat": 37.8706,
          "lng": 112.5489
        },
        {
          "id": "大同",
          "name": "大同",
          "province": "山西省",
          "social": {
            "prev": {
              "min": 4198,
              "max": 20991
            },
            "curr": {
              "min": 4244,
              "max": 21219
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "阳泉",
          "name": "阳泉",
          "province": "山西省",
          "social": {
            "prev": {
              "min": 4198,
              "max": 20991
            },
            "curr": {
              "min": 4244,
              "max": 21219
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "长治",
          "name": "长治",
          "province": "山西省",
          "social": {
            "prev": {
              "min": 4198,
              "max": 20991
            },
            "curr": {
              "min": 4244,
              "max": 21219
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "晋城",
          "name": "晋城",
          "province": "山西省",
          "social": {
            "prev": {
              "min": 4198,
              "max": 20991
            },
            "curr": {
              "min": 4244,
              "max": 21219
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "朔州",
          "name": "朔州",
          "province": "山西省",
          "social": {
            "prev": {
              "min": 4198,
              "max": 20991
            },
            "curr": {
              "min": 4244,
              "max": 21219
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "晋中",
          "name": "晋中",
          "province": "山西省",
          "social": {
            "prev": {
              "min": 4198,
              "max": 20991
            },
            "curr": {
              "min": 4244,
              "max": 21219
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "运城",
          "name": "运城",
          "province": "山西省",
          "social": {
            "prev": {
              "min": 4198,
              "max": 20991
            },
            "curr": {
              "min": 4244,
              "max": 21219
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "忻州",
          "name": "忻州",
          "province": "山西省",
          "social": {
            "prev": {
              "min": 4198,
              "max": 20991
            },
            "curr": {
              "min": 4244,
              "max": 21219
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "临汾",
          "name": "临汾",
          "province": "山西省",
          "social": {
            "prev": {
              "min": 4198,
              "max": 20991
            },
            "curr": {
              "min": 4244,
              "max": 21219
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "吕梁",
          "name": "吕梁",
          "province": "山西省",
          "social": {
            "prev": {
              "min": 4198,
              "max": 20991
            },
            "curr": {
              "min": 4244,
              "max": 21219
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        }
      ]
    },
    {
      "name": "内蒙古自治区",
      "social": [
        4907,
        24537,
        5058,
        25290,
        1
      ],
      "socialMeta": {
        "status": "legacy",
        "checkedAt": null
      },
      "cities": [
        {
          "id": "呼和浩特",
          "name": "呼和浩特",
          "province": "内蒙古自治区",
          "social": {
            "prev": {
              "min": 4907,
              "max": 24537
            },
            "curr": {
              "min": 5058,
              "max": 25290
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": 40.8424,
          "lng": 111.75
        },
        {
          "id": "包头",
          "name": "包头",
          "province": "内蒙古自治区",
          "social": {
            "prev": {
              "min": 4907,
              "max": 24537
            },
            "curr": {
              "min": 5058,
              "max": 25290
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "乌海",
          "name": "乌海",
          "province": "内蒙古自治区",
          "social": {
            "prev": {
              "min": 4907,
              "max": 24537
            },
            "curr": {
              "min": 5058,
              "max": 25290
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "赤峰",
          "name": "赤峰",
          "province": "内蒙古自治区",
          "social": {
            "prev": {
              "min": 4907,
              "max": 24537
            },
            "curr": {
              "min": 5058,
              "max": 25290
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "通辽",
          "name": "通辽",
          "province": "内蒙古自治区",
          "social": {
            "prev": {
              "min": 4907,
              "max": 24537
            },
            "curr": {
              "min": 5058,
              "max": 25290
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "鄂尔多斯",
          "name": "鄂尔多斯",
          "province": "内蒙古自治区",
          "social": {
            "prev": {
              "min": 4907,
              "max": 24537
            },
            "curr": {
              "min": 5058,
              "max": 25290
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "呼伦贝尔",
          "name": "呼伦贝尔",
          "province": "内蒙古自治区",
          "social": {
            "prev": {
              "min": 4907,
              "max": 24537
            },
            "curr": {
              "min": 5058,
              "max": 25290
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "巴彦淖尔",
          "name": "巴彦淖尔",
          "province": "内蒙古自治区",
          "social": {
            "prev": {
              "min": 4907,
              "max": 24537
            },
            "curr": {
              "min": 5058,
              "max": 25290
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "乌兰察布",
          "name": "乌兰察布",
          "province": "内蒙古自治区",
          "social": {
            "prev": {
              "min": 4907,
              "max": 24537
            },
            "curr": {
              "min": 5058,
              "max": 25290
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "兴安盟",
          "name": "兴安盟",
          "province": "内蒙古自治区",
          "social": {
            "prev": {
              "min": 4907,
              "max": 24537
            },
            "curr": {
              "min": 5058,
              "max": 25290
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "锡林郭勒盟",
          "name": "锡林郭勒盟",
          "province": "内蒙古自治区",
          "social": {
            "prev": {
              "min": 4907,
              "max": 24537
            },
            "curr": {
              "min": 5058,
              "max": 25290
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "阿拉善盟",
          "name": "阿拉善盟",
          "province": "内蒙古自治区",
          "social": {
            "prev": {
              "min": 4907,
              "max": 24537
            },
            "curr": {
              "min": 5058,
              "max": 25290
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        }
      ]
    },
    {
      "name": "辽宁省",
      "social": [
        4359,
        21792,
        4533,
        22665,
        1
      ],
      "socialMeta": {
        "status": "legacy",
        "checkedAt": null
      },
      "cities": [
        {
          "id": "沈阳",
          "name": "沈阳",
          "province": "辽宁省",
          "social": {
            "prev": {
              "min": 4359,
              "max": 21792
            },
            "curr": {
              "min": 4533,
              "max": 22665
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": 41.8057,
          "lng": 123.4315
        },
        {
          "id": "大连",
          "name": "大连",
          "province": "辽宁省",
          "social": {
            "prev": {
              "min": 4359,
              "max": 21792
            },
            "curr": {
              "min": 4533,
              "max": 22665
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": 38.914,
          "lng": 121.6147
        },
        {
          "id": "鞍山",
          "name": "鞍山",
          "province": "辽宁省",
          "social": {
            "prev": {
              "min": 4359,
              "max": 21792
            },
            "curr": {
              "min": 4533,
              "max": 22665
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "抚顺",
          "name": "抚顺",
          "province": "辽宁省",
          "social": {
            "prev": {
              "min": 4359,
              "max": 21792
            },
            "curr": {
              "min": 4533,
              "max": 22665
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "本溪",
          "name": "本溪",
          "province": "辽宁省",
          "social": {
            "prev": {
              "min": 4359,
              "max": 21792
            },
            "curr": {
              "min": 4533,
              "max": 22665
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "丹东",
          "name": "丹东",
          "province": "辽宁省",
          "social": {
            "prev": {
              "min": 4359,
              "max": 21792
            },
            "curr": {
              "min": 4533,
              "max": 22665
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "锦州",
          "name": "锦州",
          "province": "辽宁省",
          "social": {
            "prev": {
              "min": 4359,
              "max": 21792
            },
            "curr": {
              "min": 4533,
              "max": 22665
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "营口",
          "name": "营口",
          "province": "辽宁省",
          "social": {
            "prev": {
              "min": 4359,
              "max": 21792
            },
            "curr": {
              "min": 4533,
              "max": 22665
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "阜新",
          "name": "阜新",
          "province": "辽宁省",
          "social": {
            "prev": {
              "min": 4359,
              "max": 21792
            },
            "curr": {
              "min": 4533,
              "max": 22665
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "辽阳",
          "name": "辽阳",
          "province": "辽宁省",
          "social": {
            "prev": {
              "min": 4359,
              "max": 21792
            },
            "curr": {
              "min": 4533,
              "max": 22665
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "盘锦",
          "name": "盘锦",
          "province": "辽宁省",
          "social": {
            "prev": {
              "min": 4359,
              "max": 21792
            },
            "curr": {
              "min": 4533,
              "max": 22665
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "铁岭",
          "name": "铁岭",
          "province": "辽宁省",
          "social": {
            "prev": {
              "min": 4359,
              "max": 21792
            },
            "curr": {
              "min": 4533,
              "max": 22665
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "朝阳",
          "name": "朝阳",
          "province": "辽宁省",
          "social": {
            "prev": {
              "min": 4359,
              "max": 21792
            },
            "curr": {
              "min": 4533,
              "max": 22665
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "葫芦岛",
          "name": "葫芦岛",
          "province": "辽宁省",
          "social": {
            "prev": {
              "min": 4359,
              "max": 21792
            },
            "curr": {
              "min": 4533,
              "max": 22665
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        }
      ]
    },
    {
      "name": "吉林省",
      "social": [
        4393.2,
        21966,
        4488.9,
        22444.5,
        7
      ],
      "socialMeta": {
        "status": "legacy",
        "checkedAt": null
      },
      "cities": [
        {
          "id": "长春",
          "name": "长春",
          "province": "吉林省",
          "social": {
            "prev": {
              "min": 4393.2,
              "max": 21966
            },
            "curr": {
              "min": 4488.9,
              "max": 22444.5
            },
            "adjustMonth": 7,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": 43.8171,
          "lng": 125.3235
        },
        {
          "id": "吉林",
          "name": "吉林",
          "province": "吉林省",
          "social": {
            "prev": {
              "min": 4393.2,
              "max": 21966
            },
            "curr": {
              "min": 4488.9,
              "max": 22444.5
            },
            "adjustMonth": 7,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "四平",
          "name": "四平",
          "province": "吉林省",
          "social": {
            "prev": {
              "min": 4393.2,
              "max": 21966
            },
            "curr": {
              "min": 4488.9,
              "max": 22444.5
            },
            "adjustMonth": 7,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "辽源",
          "name": "辽源",
          "province": "吉林省",
          "social": {
            "prev": {
              "min": 4393.2,
              "max": 21966
            },
            "curr": {
              "min": 4488.9,
              "max": 22444.5
            },
            "adjustMonth": 7,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "通化",
          "name": "通化",
          "province": "吉林省",
          "social": {
            "prev": {
              "min": 4393.2,
              "max": 21966
            },
            "curr": {
              "min": 4488.9,
              "max": 22444.5
            },
            "adjustMonth": 7,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "白山",
          "name": "白山",
          "province": "吉林省",
          "social": {
            "prev": {
              "min": 4393.2,
              "max": 21966
            },
            "curr": {
              "min": 4488.9,
              "max": 22444.5
            },
            "adjustMonth": 7,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "松原",
          "name": "松原",
          "province": "吉林省",
          "social": {
            "prev": {
              "min": 4393.2,
              "max": 21966
            },
            "curr": {
              "min": 4488.9,
              "max": 22444.5
            },
            "adjustMonth": 7,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "白城",
          "name": "白城",
          "province": "吉林省",
          "social": {
            "prev": {
              "min": 4393.2,
              "max": 21966
            },
            "curr": {
              "min": 4488.9,
              "max": 22444.5
            },
            "adjustMonth": 7,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "延边",
          "name": "延边",
          "province": "吉林省",
          "social": {
            "prev": {
              "min": 4393.2,
              "max": 21966
            },
            "curr": {
              "min": 4488.9,
              "max": 22444.5
            },
            "adjustMonth": 7,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        }
      ]
    },
    {
      "name": "黑龙江省",
      "social": [
        4542,
        22710,
        4623,
        23115,
        1
      ],
      "socialMeta": {
        "status": "legacy",
        "checkedAt": null
      },
      "cities": [
        {
          "id": "哈尔滨",
          "name": "哈尔滨",
          "province": "黑龙江省",
          "social": {
            "prev": {
              "min": 4542,
              "max": 22710
            },
            "curr": {
              "min": 4623,
              "max": 23115
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": 45.8038,
          "lng": 126.5349
        },
        {
          "id": "齐齐哈尔",
          "name": "齐齐哈尔",
          "province": "黑龙江省",
          "social": {
            "prev": {
              "min": 4542,
              "max": 22710
            },
            "curr": {
              "min": 4623,
              "max": 23115
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "鸡西",
          "name": "鸡西",
          "province": "黑龙江省",
          "social": {
            "prev": {
              "min": 4542,
              "max": 22710
            },
            "curr": {
              "min": 4623,
              "max": 23115
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "鹤岗",
          "name": "鹤岗",
          "province": "黑龙江省",
          "social": {
            "prev": {
              "min": 4542,
              "max": 22710
            },
            "curr": {
              "min": 4623,
              "max": 23115
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "双鸭山",
          "name": "双鸭山",
          "province": "黑龙江省",
          "social": {
            "prev": {
              "min": 4542,
              "max": 22710
            },
            "curr": {
              "min": 4623,
              "max": 23115
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "大庆",
          "name": "大庆",
          "province": "黑龙江省",
          "social": {
            "prev": {
              "min": 4542,
              "max": 22710
            },
            "curr": {
              "min": 4623,
              "max": 23115
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "伊春",
          "name": "伊春",
          "province": "黑龙江省",
          "social": {
            "prev": {
              "min": 4542,
              "max": 22710
            },
            "curr": {
              "min": 4623,
              "max": 23115
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "佳木斯",
          "name": "佳木斯",
          "province": "黑龙江省",
          "social": {
            "prev": {
              "min": 4542,
              "max": 22710
            },
            "curr": {
              "min": 4623,
              "max": 23115
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "七台河",
          "name": "七台河",
          "province": "黑龙江省",
          "social": {
            "prev": {
              "min": 4542,
              "max": 22710
            },
            "curr": {
              "min": 4623,
              "max": 23115
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "牡丹江",
          "name": "牡丹江",
          "province": "黑龙江省",
          "social": {
            "prev": {
              "min": 4542,
              "max": 22710
            },
            "curr": {
              "min": 4623,
              "max": 23115
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "黑河",
          "name": "黑河",
          "province": "黑龙江省",
          "social": {
            "prev": {
              "min": 4542,
              "max": 22710
            },
            "curr": {
              "min": 4623,
              "max": 23115
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "绥化",
          "name": "绥化",
          "province": "黑龙江省",
          "social": {
            "prev": {
              "min": 4542,
              "max": 22710
            },
            "curr": {
              "min": 4623,
              "max": 23115
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "大兴安岭",
          "name": "大兴安岭",
          "province": "黑龙江省",
          "social": {
            "prev": {
              "min": 4542,
              "max": 22710
            },
            "curr": {
              "min": 4623,
              "max": 23115
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        }
      ]
    },
    {
      "name": "江苏省",
      "social": [
        4952,
        24762,
        5025,
        25127,
        1
      ],
      "socialMeta": {
        "status": "legacy",
        "checkedAt": null
      },
      "cities": [
        {
          "id": "南京",
          "name": "南京",
          "province": "江苏省",
          "social": {
            "prev": {
              "min": 4952,
              "max": 24762
            },
            "curr": {
              "min": 5025,
              "max": 25127
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": {
            "prev": {
              "min": 2660,
              "max": 42400
            },
            "curr": {
              "min": 2660,
              "max": 42400
            },
            "adjustMonth": 7,
            "note": "缺 2025 年度原文，1–6 月暂按 2026 年度基数计算",
            "meta": {
              "status": "official",
              "checkedAt": "2026-11-23T11:41:19.378Z",
              "from": "2026-07-01",
              "to": "2027-06-30",
              "basisYear": 2025,
              "prevMissing": true,
              "doc": "宁金管规〔2026〕2号",
              "source": "https://gjj.nanjing.gov.cn/zwgk/tzgg/202607/t20260717_5878580.html",
              "title": "组织机构 通知公告 执法公告 中心动态 政府信息公开年报 双随机、一公开 通知公告 当前位置",
              "via": "http",
              "segments": [
                {
                  "from": "2026-07-01",
                  "to": "2027-06-30",
                  "min": 2660,
                  "max": 42400,
                  "status": "verified"
                }
              ]
            },
            "segments": [
              {
                "from": "2026-07-01",
                "to": "2027-06-30",
                "min": 2660,
                "max": 42400,
                "status": "verified"
              }
            ]
          },
          "housingRates": [
            0.05,
            0.12
          ],
          "lat": 32.0603,
          "lng": 118.7969
        },
        {
          "id": "无锡",
          "name": "无锡",
          "province": "江苏省",
          "social": {
            "prev": {
              "min": 4952,
              "max": 24762
            },
            "curr": {
              "min": 5025,
              "max": 25127
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": {
            "prev": {
              "min": 2490,
              "max": 38900
            },
            "curr": {
              "min": 2490,
              "max": 38900
            },
            "adjustMonth": 7,
            "note": "2026未更新",
            "meta": {
              "status": "legacy",
              "checkedAt": null,
              "note": "2026未更新"
            },
            "segments": []
          },
          "housingRates": [
            0.05,
            0.12
          ],
          "lat": 31.4912,
          "lng": 120.3119
        },
        {
          "id": "徐州",
          "name": "徐州",
          "province": "江苏省",
          "social": {
            "prev": {
              "min": 4952,
              "max": 24762
            },
            "curr": {
              "min": 5025,
              "max": 25127
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "常州",
          "name": "常州",
          "province": "江苏省",
          "social": {
            "prev": {
              "min": 4952,
              "max": 24762
            },
            "curr": {
              "min": 5025,
              "max": 25127
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "苏州",
          "name": "苏州",
          "province": "江苏省",
          "social": {
            "prev": {
              "min": 4952,
              "max": 24762
            },
            "curr": {
              "min": 5025,
              "max": 25127
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": {
            "prev": {
              "min": 2490,
              "max": 38900
            },
            "curr": {
              "min": 2490,
              "max": 38900
            },
            "adjustMonth": 7,
            "note": "2026未更新",
            "meta": {
              "status": "legacy",
              "checkedAt": null,
              "note": "2026未更新"
            },
            "segments": []
          },
          "housingRates": [
            0.05,
            0.12
          ],
          "lat": 31.2989,
          "lng": 120.5853
        },
        {
          "id": "南通",
          "name": "南通",
          "province": "江苏省",
          "social": {
            "prev": {
              "min": 4952,
              "max": 24762
            },
            "curr": {
              "min": 5025,
              "max": 25127
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "连云港",
          "name": "连云港",
          "province": "江苏省",
          "social": {
            "prev": {
              "min": 4952,
              "max": 24762
            },
            "curr": {
              "min": 5025,
              "max": 25127
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "淮安",
          "name": "淮安",
          "province": "江苏省",
          "social": {
            "prev": {
              "min": 4952,
              "max": 24762
            },
            "curr": {
              "min": 5025,
              "max": 25127
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "盐城",
          "name": "盐城",
          "province": "江苏省",
          "social": {
            "prev": {
              "min": 4952,
              "max": 24762
            },
            "curr": {
              "min": 5025,
              "max": 25127
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "扬州",
          "name": "扬州",
          "province": "江苏省",
          "social": {
            "prev": {
              "min": 4952,
              "max": 24762
            },
            "curr": {
              "min": 5025,
              "max": 25127
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "镇江",
          "name": "镇江",
          "province": "江苏省",
          "social": {
            "prev": {
              "min": 4952,
              "max": 24762
            },
            "curr": {
              "min": 5025,
              "max": 25127
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "泰州",
          "name": "泰州",
          "province": "江苏省",
          "social": {
            "prev": {
              "min": 4952,
              "max": 24762
            },
            "curr": {
              "min": 5025,
              "max": 25127
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "宿迁",
          "name": "宿迁",
          "province": "江苏省",
          "social": {
            "prev": {
              "min": 4952,
              "max": 24762
            },
            "curr": {
              "min": 5025,
              "max": 25127
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        }
      ]
    },
    {
      "name": "浙江省",
      "social": [
        4986,
        25299,
        5122,
        25611,
        1
      ],
      "socialMeta": {
        "status": "legacy",
        "checkedAt": null
      },
      "cities": [
        {
          "id": "杭州",
          "name": "杭州",
          "province": "浙江省",
          "social": {
            "prev": {
              "min": 4986,
              "max": 25299
            },
            "curr": {
              "min": 5122,
              "max": 25611
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": {
            "prev": {
              "min": 2490,
              "max": 40694
            },
            "curr": {
              "min": 2660,
              "max": 42151
            },
            "adjustMonth": 7,
            "note": "",
            "meta": {
              "status": "official",
              "checkedAt": "2026-11-23T11:41:19.377Z",
              "from": "2026-07-01",
              "to": "2027-06-30",
              "basisYear": 2025,
              "prevMissing": false,
              "doc": "杭公积金〔2026〕21号",
              "source": "https://gjj.hangzhou.gov.cn/cms_files/filemanager/1568099/attach/20267/05bea603588e491483f107735ae7b254.pdf",
              "title": "杭州住房公积金管理中心文件 杭公积金〔2026〕21号 杭州住房公积金管理中心关于开展 20",
              "via": "ai",
              "segments": [
                {
                  "from": "2025-07-01",
                  "to": "2026-06-30",
                  "min": 2490,
                  "max": 40694,
                  "status": "verified"
                },
                {
                  "from": "2026-07-01",
                  "to": "2027-06-30",
                  "min": 2660,
                  "max": 42151,
                  "status": "verified"
                }
              ]
            },
            "segments": [
              {
                "from": "2025-07-01",
                "to": "2026-06-30",
                "min": 2490,
                "max": 40694,
                "status": "verified"
              },
              {
                "from": "2026-07-01",
                "to": "2027-06-30",
                "min": 2660,
                "max": 42151,
                "status": "verified"
              }
            ]
          },
          "housingRates": [
            0.05,
            0.12
          ],
          "lat": 30.2741,
          "lng": 120.1551
        },
        {
          "id": "宁波",
          "name": "宁波",
          "province": "浙江省",
          "social": {
            "prev": {
              "min": 4986,
              "max": 25299
            },
            "curr": {
              "min": 5122,
              "max": 25611
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": {
            "prev": {
              "min": 2490,
              "max": 38907
            },
            "curr": {
              "min": 2430,
              "max": 38907
            },
            "adjustMonth": 1,
            "note": "按自然年度",
            "meta": {
              "status": "legacy",
              "checkedAt": null,
              "note": "按自然年度"
            },
            "segments": []
          },
          "housingRates": [
            0.05,
            0.12
          ],
          "lat": 29.8683,
          "lng": 121.544
        },
        {
          "id": "温州",
          "name": "温州",
          "province": "浙江省",
          "social": {
            "prev": {
              "min": 4986,
              "max": 25299
            },
            "curr": {
              "min": 5122,
              "max": 25611
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": 27.9938,
          "lng": 120.6994
        },
        {
          "id": "嘉兴",
          "name": "嘉兴",
          "province": "浙江省",
          "social": {
            "prev": {
              "min": 4986,
              "max": 25299
            },
            "curr": {
              "min": 5122,
              "max": 25611
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "湖州",
          "name": "湖州",
          "province": "浙江省",
          "social": {
            "prev": {
              "min": 4986,
              "max": 25299
            },
            "curr": {
              "min": 5122,
              "max": 25611
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "绍兴",
          "name": "绍兴",
          "province": "浙江省",
          "social": {
            "prev": {
              "min": 4986,
              "max": 25299
            },
            "curr": {
              "min": 5122,
              "max": 25611
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "金华",
          "name": "金华",
          "province": "浙江省",
          "social": {
            "prev": {
              "min": 4986,
              "max": 25299
            },
            "curr": {
              "min": 5122,
              "max": 25611
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "衢州",
          "name": "衢州",
          "province": "浙江省",
          "social": {
            "prev": {
              "min": 4986,
              "max": 25299
            },
            "curr": {
              "min": 5122,
              "max": 25611
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "舟山",
          "name": "舟山",
          "province": "浙江省",
          "social": {
            "prev": {
              "min": 4986,
              "max": 25299
            },
            "curr": {
              "min": 5122,
              "max": 25611
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "台州",
          "name": "台州",
          "province": "浙江省",
          "social": {
            "prev": {
              "min": 4986,
              "max": 25299
            },
            "curr": {
              "min": 5122,
              "max": 25611
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "丽水",
          "name": "丽水",
          "province": "浙江省",
          "social": {
            "prev": {
              "min": 4986,
              "max": 25299
            },
            "curr": {
              "min": 5122,
              "max": 25611
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        }
      ]
    },
    {
      "name": "安徽省",
      "social": [
        4311,
        21556,
        4354,
        21772,
        1
      ],
      "socialMeta": {
        "status": "legacy",
        "checkedAt": null
      },
      "cities": [
        {
          "id": "合肥",
          "name": "合肥",
          "province": "安徽省",
          "social": {
            "prev": {
              "min": 4311,
              "max": 21556
            },
            "curr": {
              "min": 4354,
              "max": 21772
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": {
            "prev": {
              "min": 2060,
              "max": 30540
            },
            "curr": {
              "min": 2060,
              "max": 31564
            },
            "adjustMonth": 1,
            "note": "按自然年度",
            "meta": {
              "status": "legacy",
              "checkedAt": null,
              "note": "按自然年度"
            },
            "segments": []
          },
          "housingRates": [
            0.05,
            0.12
          ],
          "lat": 31.8206,
          "lng": 117.2272
        },
        {
          "id": "芜湖",
          "name": "芜湖",
          "province": "安徽省",
          "social": {
            "prev": {
              "min": 4311,
              "max": 21556
            },
            "curr": {
              "min": 4354,
              "max": 21772
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "蚌埠",
          "name": "蚌埠",
          "province": "安徽省",
          "social": {
            "prev": {
              "min": 4311,
              "max": 21556
            },
            "curr": {
              "min": 4354,
              "max": 21772
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "淮南",
          "name": "淮南",
          "province": "安徽省",
          "social": {
            "prev": {
              "min": 4311,
              "max": 21556
            },
            "curr": {
              "min": 4354,
              "max": 21772
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "马鞍山",
          "name": "马鞍山",
          "province": "安徽省",
          "social": {
            "prev": {
              "min": 4311,
              "max": 21556
            },
            "curr": {
              "min": 4354,
              "max": 21772
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "淮北",
          "name": "淮北",
          "province": "安徽省",
          "social": {
            "prev": {
              "min": 4311,
              "max": 21556
            },
            "curr": {
              "min": 4354,
              "max": 21772
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "铜陵",
          "name": "铜陵",
          "province": "安徽省",
          "social": {
            "prev": {
              "min": 4311,
              "max": 21556
            },
            "curr": {
              "min": 4354,
              "max": 21772
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "安庆",
          "name": "安庆",
          "province": "安徽省",
          "social": {
            "prev": {
              "min": 4311,
              "max": 21556
            },
            "curr": {
              "min": 4354,
              "max": 21772
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "黄山",
          "name": "黄山",
          "province": "安徽省",
          "social": {
            "prev": {
              "min": 4311,
              "max": 21556
            },
            "curr": {
              "min": 4354,
              "max": 21772
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": {
            "prev": {
              "min": 2100,
              "max": 24545
            },
            "curr": {
              "min": 2100,
              "max": 24545
            },
            "adjustMonth": 1,
            "note": "按自然年度",
            "meta": {
              "status": "legacy",
              "checkedAt": null,
              "note": "按自然年度"
            },
            "segments": []
          },
          "housingRates": [
            0.05,
            0.12
          ],
          "lat": 29.7147,
          "lng": 118.3376
        },
        {
          "id": "滁州",
          "name": "滁州",
          "province": "安徽省",
          "social": {
            "prev": {
              "min": 4311,
              "max": 21556
            },
            "curr": {
              "min": 4354,
              "max": 21772
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "阜阳",
          "name": "阜阳",
          "province": "安徽省",
          "social": {
            "prev": {
              "min": 4311,
              "max": 21556
            },
            "curr": {
              "min": 4354,
              "max": 21772
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": {
            "prev": {
              "min": 2060,
              "max": 23817
            },
            "curr": {
              "min": 2060,
              "max": 23817
            },
            "adjustMonth": 1,
            "note": "按自然年度",
            "meta": {
              "status": "legacy",
              "checkedAt": null,
              "note": "按自然年度"
            },
            "segments": []
          },
          "housingRates": [
            0.05,
            0.12
          ],
          "lat": 32.8901,
          "lng": 115.8145
        },
        {
          "id": "宿州",
          "name": "宿州",
          "province": "安徽省",
          "social": {
            "prev": {
              "min": 4311,
              "max": 21556
            },
            "curr": {
              "min": 4354,
              "max": 21772
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "六安",
          "name": "六安",
          "province": "安徽省",
          "social": {
            "prev": {
              "min": 4311,
              "max": 21556
            },
            "curr": {
              "min": 4354,
              "max": 21772
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "亳州",
          "name": "亳州",
          "province": "安徽省",
          "social": {
            "prev": {
              "min": 4311,
              "max": 21556
            },
            "curr": {
              "min": 4354,
              "max": 21772
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "池州",
          "name": "池州",
          "province": "安徽省",
          "social": {
            "prev": {
              "min": 4311,
              "max": 21556
            },
            "curr": {
              "min": 4354,
              "max": 21772
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "宣城",
          "name": "宣城",
          "province": "安徽省",
          "social": {
            "prev": {
              "min": 4311,
              "max": 21556
            },
            "curr": {
              "min": 4354,
              "max": 21772
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        }
      ]
    },
    {
      "name": "福建省",
      "social": [
        4043,
        22164,
        4579,
        22893,
        1
      ],
      "socialMeta": {
        "status": "legacy",
        "checkedAt": null
      },
      "cities": [
        {
          "id": "福州",
          "name": "福州",
          "province": "福建省",
          "social": {
            "prev": {
              "min": 4043,
              "max": 22164
            },
            "curr": {
              "min": 4579,
              "max": 22893
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": {
            "prev": {
              "min": 2195,
              "max": 32430
            },
            "curr": {
              "min": 2195,
              "max": 32430
            },
            "adjustMonth": 1,
            "note": "",
            "meta": {
              "status": "legacy",
              "checkedAt": null,
              "note": ""
            },
            "segments": []
          },
          "housingRates": [
            0.05,
            0.12
          ],
          "lat": 26.0745,
          "lng": 119.2965
        },
        {
          "id": "厦门",
          "name": "厦门",
          "province": "福建省",
          "social": {
            "prev": {
              "min": 4043,
              "max": 22164
            },
            "curr": {
              "min": 4579,
              "max": 22893
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": {
            "prev": {
              "min": 2265,
              "max": 32346
            },
            "curr": {
              "min": 2265,
              "max": 32937
            },
            "adjustMonth": 1,
            "note": "",
            "meta": {
              "status": "legacy",
              "checkedAt": null,
              "note": ""
            },
            "segments": []
          },
          "housingRates": [
            0.05,
            0.12
          ],
          "lat": 24.4798,
          "lng": 118.0894
        },
        {
          "id": "莆田",
          "name": "莆田",
          "province": "福建省",
          "social": {
            "prev": {
              "min": 4043,
              "max": 22164
            },
            "curr": {
              "min": 4579,
              "max": 22893
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "三明",
          "name": "三明",
          "province": "福建省",
          "social": {
            "prev": {
              "min": 4043,
              "max": 22164
            },
            "curr": {
              "min": 4579,
              "max": 22893
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "泉州",
          "name": "泉州",
          "province": "福建省",
          "social": {
            "prev": {
              "min": 4043,
              "max": 22164
            },
            "curr": {
              "min": 4579,
              "max": 22893
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "漳州",
          "name": "漳州",
          "province": "福建省",
          "social": {
            "prev": {
              "min": 4043,
              "max": 22164
            },
            "curr": {
              "min": 4579,
              "max": 22893
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "南平",
          "name": "南平",
          "province": "福建省",
          "social": {
            "prev": {
              "min": 4043,
              "max": 22164
            },
            "curr": {
              "min": 4579,
              "max": 22893
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "龙岩",
          "name": "龙岩",
          "province": "福建省",
          "social": {
            "prev": {
              "min": 4043,
              "max": 22164
            },
            "curr": {
              "min": 4579,
              "max": 22893
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "宁德",
          "name": "宁德",
          "province": "福建省",
          "social": {
            "prev": {
              "min": 4043,
              "max": 22164
            },
            "curr": {
              "min": 4579,
              "max": 22893
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": {
            "prev": {
              "min": 2195,
              "max": 27166
            },
            "curr": {
              "min": 2195,
              "max": 27166
            },
            "adjustMonth": 7,
            "note": "",
            "meta": {
              "status": "legacy",
              "checkedAt": null,
              "note": ""
            },
            "segments": []
          },
          "housingRates": [
            0.05,
            0.12
          ],
          "lat": 26.6656,
          "lng": 119.5483
        }
      ]
    },
    {
      "name": "江西省",
      "social": [
        3915,
        19575,
        3990,
        19947,
        1
      ],
      "socialMeta": {
        "status": "legacy",
        "checkedAt": null
      },
      "cities": [
        {
          "id": "南昌",
          "name": "南昌",
          "province": "江西省",
          "social": {
            "prev": {
              "min": 3915,
              "max": 19575
            },
            "curr": {
              "min": 3990,
              "max": 19947
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": 28.682,
          "lng": 115.8579
        },
        {
          "id": "景德镇",
          "name": "景德镇",
          "province": "江西省",
          "social": {
            "prev": {
              "min": 3915,
              "max": 19575
            },
            "curr": {
              "min": 3990,
              "max": 19947
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "萍乡",
          "name": "萍乡",
          "province": "江西省",
          "social": {
            "prev": {
              "min": 3915,
              "max": 19575
            },
            "curr": {
              "min": 3990,
              "max": 19947
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "九江",
          "name": "九江",
          "province": "江西省",
          "social": {
            "prev": {
              "min": 3915,
              "max": 19575
            },
            "curr": {
              "min": 3990,
              "max": 19947
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "新余",
          "name": "新余",
          "province": "江西省",
          "social": {
            "prev": {
              "min": 3915,
              "max": 19575
            },
            "curr": {
              "min": 3990,
              "max": 19947
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "鹰潭",
          "name": "鹰潭",
          "province": "江西省",
          "social": {
            "prev": {
              "min": 3915,
              "max": 19575
            },
            "curr": {
              "min": 3990,
              "max": 19947
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "赣州",
          "name": "赣州",
          "province": "江西省",
          "social": {
            "prev": {
              "min": 3915,
              "max": 19575
            },
            "curr": {
              "min": 3990,
              "max": 19947
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "吉安",
          "name": "吉安",
          "province": "江西省",
          "social": {
            "prev": {
              "min": 3915,
              "max": 19575
            },
            "curr": {
              "min": 3990,
              "max": 19947
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "宜春",
          "name": "宜春",
          "province": "江西省",
          "social": {
            "prev": {
              "min": 3915,
              "max": 19575
            },
            "curr": {
              "min": 3990,
              "max": 19947
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "抚州",
          "name": "抚州",
          "province": "江西省",
          "social": {
            "prev": {
              "min": 3915,
              "max": 19575
            },
            "curr": {
              "min": 3990,
              "max": 19947
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "上饶",
          "name": "上饶",
          "province": "江西省",
          "social": {
            "prev": {
              "min": 3915,
              "max": 19575
            },
            "curr": {
              "min": 3990,
              "max": 19947
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        }
      ]
    },
    {
      "name": "山东省",
      "social": [
        4504,
        22518,
        4573,
        22863,
        1
      ],
      "socialMeta": {
        "status": "legacy",
        "checkedAt": null
      },
      "cities": [
        {
          "id": "济南",
          "name": "济南",
          "province": "山东省",
          "social": {
            "prev": {
              "min": 4504,
              "max": 22518
            },
            "curr": {
              "min": 4573,
              "max": 22863
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": {
            "prev": {
              "min": 2400,
              "max": 33902
            },
            "curr": {
              "min": 2400,
              "max": 33902
            },
            "adjustMonth": 7,
            "note": "采集自官网，仅得 2026 一年数据",
            "meta": {
              "status": "legacy",
              "checkedAt": null,
              "note": "采集自官网，仅得 2026 一年数据"
            },
            "segments": []
          },
          "housingRates": [
            0.05,
            0.12
          ],
          "lat": 36.6512,
          "lng": 117.1201
        },
        {
          "id": "青岛",
          "name": "青岛",
          "province": "山东省",
          "social": {
            "prev": {
              "min": 4504,
              "max": 22518
            },
            "curr": {
              "min": 4573,
              "max": 22863
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": {
            "prev": {
              "min": 2200,
              "max": 33093
            },
            "curr": {
              "min": 2200,
              "max": 33093
            },
            "adjustMonth": 7,
            "note": "2026未更新",
            "meta": {
              "status": "legacy",
              "checkedAt": null,
              "note": "2026未更新"
            },
            "segments": []
          },
          "housingRates": [
            0.05,
            0.12
          ],
          "lat": 36.0671,
          "lng": 120.3826
        },
        {
          "id": "淄博",
          "name": "淄博",
          "province": "山东省",
          "social": {
            "prev": {
              "min": 4504,
              "max": 22518
            },
            "curr": {
              "min": 4573,
              "max": 22863
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "枣庄",
          "name": "枣庄",
          "province": "山东省",
          "social": {
            "prev": {
              "min": 4504,
              "max": 22518
            },
            "curr": {
              "min": 4573,
              "max": 22863
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "东营",
          "name": "东营",
          "province": "山东省",
          "social": {
            "prev": {
              "min": 4504,
              "max": 22518
            },
            "curr": {
              "min": 4573,
              "max": 22863
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "烟台",
          "name": "烟台",
          "province": "山东省",
          "social": {
            "prev": {
              "min": 4504,
              "max": 22518
            },
            "curr": {
              "min": 4573,
              "max": 22863
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "潍坊",
          "name": "潍坊",
          "province": "山东省",
          "social": {
            "prev": {
              "min": 4504,
              "max": 22518
            },
            "curr": {
              "min": 4573,
              "max": 22863
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "济宁",
          "name": "济宁",
          "province": "山东省",
          "social": {
            "prev": {
              "min": 4504,
              "max": 22518
            },
            "curr": {
              "min": 4573,
              "max": 22863
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "泰安",
          "name": "泰安",
          "province": "山东省",
          "social": {
            "prev": {
              "min": 4504,
              "max": 22518
            },
            "curr": {
              "min": 4573,
              "max": 22863
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "威海",
          "name": "威海",
          "province": "山东省",
          "social": {
            "prev": {
              "min": 4504,
              "max": 22518
            },
            "curr": {
              "min": 4573,
              "max": 22863
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "日照",
          "name": "日照",
          "province": "山东省",
          "social": {
            "prev": {
              "min": 4504,
              "max": 22518
            },
            "curr": {
              "min": 4573,
              "max": 22863
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "临沂",
          "name": "临沂",
          "province": "山东省",
          "social": {
            "prev": {
              "min": 4504,
              "max": 22518
            },
            "curr": {
              "min": 4573,
              "max": 22863
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "德州",
          "name": "德州",
          "province": "山东省",
          "social": {
            "prev": {
              "min": 4504,
              "max": 22518
            },
            "curr": {
              "min": 4573,
              "max": 22863
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "聊城",
          "name": "聊城",
          "province": "山东省",
          "social": {
            "prev": {
              "min": 4504,
              "max": 22518
            },
            "curr": {
              "min": 4573,
              "max": 22863
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "滨州",
          "name": "滨州",
          "province": "山东省",
          "social": {
            "prev": {
              "min": 4504,
              "max": 22518
            },
            "curr": {
              "min": 4573,
              "max": 22863
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "菏泽",
          "name": "菏泽",
          "province": "山东省",
          "social": {
            "prev": {
              "min": 4504,
              "max": 22518
            },
            "curr": {
              "min": 4573,
              "max": 22863
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        }
      ]
    },
    {
      "name": "河南省",
      "social": [
        3912,
        19560,
        3912,
        19560,
        7
      ],
      "socialMeta": {
        "status": "official",
        "checkedAt": "2026-11-23T11:48:58.373Z",
        "from": "2026-07-01",
        "to": "2027-06-30",
        "basisYear": 2025,
        "prevMissing": true,
        "doc": "〔2026〕62号",
        "source": "http://hrss.henan.gov.cn/2026/10-10/3435886.html",
        "title": "河南省人力资源和社会保障厅 河南省医疗保障局 河南省财政厅 国家税务总局河南省税务局关于公布",
        "via": "http",
        "segments": [
          {
            "from": "2026-07-01",
            "to": "2027-06-30",
            "min": 3912,
            "max": 19560,
            "status": "verified"
          }
        ]
      },
      "cities": [
        {
          "id": "郑州",
          "name": "郑州",
          "province": "河南省",
          "social": {
            "prev": {
              "min": 3912,
              "max": 19560
            },
            "curr": {
              "min": 3912,
              "max": 19560
            },
            "adjustMonth": 7,
            "meta": {
              "status": "official",
              "checkedAt": "2026-11-23T11:48:58.373Z",
              "from": "2026-07-01",
              "to": "2027-06-30",
              "basisYear": 2025,
              "prevMissing": true,
              "doc": "〔2026〕62号",
              "source": "http://hrss.henan.gov.cn/2026/10-10/3435886.html",
              "title": "河南省人力资源和社会保障厅 河南省医疗保障局 河南省财政厅 国家税务总局河南省税务局关于公布",
              "via": "http",
              "segments": [
                {
                  "from": "2026-07-01",
                  "to": "2027-06-30",
                  "min": 3912,
                  "max": 19560,
                  "status": "verified"
                }
              ]
            },
            "segments": [
              {
                "from": "2026-07-01",
                "to": "2027-06-30",
                "min": 3912,
                "max": 19560,
                "status": "verified"
              }
            ]
          },
          "housing": {
            "prev": {
              "min": 2350,
              "max": 28849
            },
            "curr": {
              "min": 2350,
              "max": 28849
            },
            "adjustMonth": 7,
            "note": "缺 2025 年度原文，1–6 月暂按 2026 年度基数计算",
            "meta": {
              "status": "suspect",
              "checkedAt": "2026-11-23T11:41:19.378Z",
              "from": "2026-07-01",
              "to": "2027-06-30",
              "basisYear": 2025,
              "prevMissing": true,
              "doc": "郑公积金〔2026〕18号",
              "source": "https://zzgjj.zhengzhou.gov.cn/zcfg/10197385.jhtml",
              "title": "河南省人民政府 河南省住房和城乡建设厅 郑州市人民政府 郑州政务服务网 繁體 登录 首页 机",
              "via": "http",
              "segments": [
                {
                  "from": "2026-07-01",
                  "to": "2027-06-30",
                  "min": 2350,
                  "max": 28849,
                  "status": "suspect"
                }
              ]
            },
            "segments": [
              {
                "from": "2026-07-01",
                "to": "2027-06-30",
                "min": 2350,
                "max": 28849,
                "status": "suspect"
              }
            ]
          },
          "housingRates": [
            0.05,
            0.12
          ],
          "lat": 34.7466,
          "lng": 113.6253
        },
        {
          "id": "开封",
          "name": "开封",
          "province": "河南省",
          "social": {
            "prev": {
              "min": 3912,
              "max": 19560
            },
            "curr": {
              "min": 3912,
              "max": 19560
            },
            "adjustMonth": 7,
            "meta": {
              "status": "official",
              "checkedAt": "2026-11-23T11:48:58.373Z",
              "from": "2026-07-01",
              "to": "2027-06-30",
              "basisYear": 2025,
              "prevMissing": true,
              "doc": "〔2026〕62号",
              "source": "http://hrss.henan.gov.cn/2026/10-10/3435886.html",
              "title": "河南省人力资源和社会保障厅 河南省医疗保障局 河南省财政厅 国家税务总局河南省税务局关于公布",
              "via": "http",
              "segments": [
                {
                  "from": "2026-07-01",
                  "to": "2027-06-30",
                  "min": 3912,
                  "max": 19560,
                  "status": "verified"
                }
              ]
            },
            "segments": [
              {
                "from": "2026-07-01",
                "to": "2027-06-30",
                "min": 3912,
                "max": 19560,
                "status": "verified"
              }
            ]
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "洛阳",
          "name": "洛阳",
          "province": "河南省",
          "social": {
            "prev": {
              "min": 3912,
              "max": 19560
            },
            "curr": {
              "min": 3912,
              "max": 19560
            },
            "adjustMonth": 7,
            "meta": {
              "status": "official",
              "checkedAt": "2026-11-23T11:48:58.373Z",
              "from": "2026-07-01",
              "to": "2027-06-30",
              "basisYear": 2025,
              "prevMissing": true,
              "doc": "〔2026〕62号",
              "source": "http://hrss.henan.gov.cn/2026/10-10/3435886.html",
              "title": "河南省人力资源和社会保障厅 河南省医疗保障局 河南省财政厅 国家税务总局河南省税务局关于公布",
              "via": "http",
              "segments": [
                {
                  "from": "2026-07-01",
                  "to": "2027-06-30",
                  "min": 3912,
                  "max": 19560,
                  "status": "verified"
                }
              ]
            },
            "segments": [
              {
                "from": "2026-07-01",
                "to": "2027-06-30",
                "min": 3912,
                "max": 19560,
                "status": "verified"
              }
            ]
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "平顶山",
          "name": "平顶山",
          "province": "河南省",
          "social": {
            "prev": {
              "min": 3912,
              "max": 19560
            },
            "curr": {
              "min": 3912,
              "max": 19560
            },
            "adjustMonth": 7,
            "meta": {
              "status": "official",
              "checkedAt": "2026-11-23T11:48:58.373Z",
              "from": "2026-07-01",
              "to": "2027-06-30",
              "basisYear": 2025,
              "prevMissing": true,
              "doc": "〔2026〕62号",
              "source": "http://hrss.henan.gov.cn/2026/10-10/3435886.html",
              "title": "河南省人力资源和社会保障厅 河南省医疗保障局 河南省财政厅 国家税务总局河南省税务局关于公布",
              "via": "http",
              "segments": [
                {
                  "from": "2026-07-01",
                  "to": "2027-06-30",
                  "min": 3912,
                  "max": 19560,
                  "status": "verified"
                }
              ]
            },
            "segments": [
              {
                "from": "2026-07-01",
                "to": "2027-06-30",
                "min": 3912,
                "max": 19560,
                "status": "verified"
              }
            ]
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "安阳",
          "name": "安阳",
          "province": "河南省",
          "social": {
            "prev": {
              "min": 3912,
              "max": 19560
            },
            "curr": {
              "min": 3912,
              "max": 19560
            },
            "adjustMonth": 7,
            "meta": {
              "status": "official",
              "checkedAt": "2026-11-23T11:48:58.373Z",
              "from": "2026-07-01",
              "to": "2027-06-30",
              "basisYear": 2025,
              "prevMissing": true,
              "doc": "〔2026〕62号",
              "source": "http://hrss.henan.gov.cn/2026/10-10/3435886.html",
              "title": "河南省人力资源和社会保障厅 河南省医疗保障局 河南省财政厅 国家税务总局河南省税务局关于公布",
              "via": "http",
              "segments": [
                {
                  "from": "2026-07-01",
                  "to": "2027-06-30",
                  "min": 3912,
                  "max": 19560,
                  "status": "verified"
                }
              ]
            },
            "segments": [
              {
                "from": "2026-07-01",
                "to": "2027-06-30",
                "min": 3912,
                "max": 19560,
                "status": "verified"
              }
            ]
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "鹤壁",
          "name": "鹤壁",
          "province": "河南省",
          "social": {
            "prev": {
              "min": 3912,
              "max": 19560
            },
            "curr": {
              "min": 3912,
              "max": 19560
            },
            "adjustMonth": 7,
            "meta": {
              "status": "official",
              "checkedAt": "2026-11-23T11:48:58.373Z",
              "from": "2026-07-01",
              "to": "2027-06-30",
              "basisYear": 2025,
              "prevMissing": true,
              "doc": "〔2026〕62号",
              "source": "http://hrss.henan.gov.cn/2026/10-10/3435886.html",
              "title": "河南省人力资源和社会保障厅 河南省医疗保障局 河南省财政厅 国家税务总局河南省税务局关于公布",
              "via": "http",
              "segments": [
                {
                  "from": "2026-07-01",
                  "to": "2027-06-30",
                  "min": 3912,
                  "max": 19560,
                  "status": "verified"
                }
              ]
            },
            "segments": [
              {
                "from": "2026-07-01",
                "to": "2027-06-30",
                "min": 3912,
                "max": 19560,
                "status": "verified"
              }
            ]
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "新乡",
          "name": "新乡",
          "province": "河南省",
          "social": {
            "prev": {
              "min": 3912,
              "max": 19560
            },
            "curr": {
              "min": 3912,
              "max": 19560
            },
            "adjustMonth": 7,
            "meta": {
              "status": "official",
              "checkedAt": "2026-11-23T11:48:58.373Z",
              "from": "2026-07-01",
              "to": "2027-06-30",
              "basisYear": 2025,
              "prevMissing": true,
              "doc": "〔2026〕62号",
              "source": "http://hrss.henan.gov.cn/2026/10-10/3435886.html",
              "title": "河南省人力资源和社会保障厅 河南省医疗保障局 河南省财政厅 国家税务总局河南省税务局关于公布",
              "via": "http",
              "segments": [
                {
                  "from": "2026-07-01",
                  "to": "2027-06-30",
                  "min": 3912,
                  "max": 19560,
                  "status": "verified"
                }
              ]
            },
            "segments": [
              {
                "from": "2026-07-01",
                "to": "2027-06-30",
                "min": 3912,
                "max": 19560,
                "status": "verified"
              }
            ]
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "焦作",
          "name": "焦作",
          "province": "河南省",
          "social": {
            "prev": {
              "min": 3912,
              "max": 19560
            },
            "curr": {
              "min": 3912,
              "max": 19560
            },
            "adjustMonth": 7,
            "meta": {
              "status": "official",
              "checkedAt": "2026-11-23T11:48:58.373Z",
              "from": "2026-07-01",
              "to": "2027-06-30",
              "basisYear": 2025,
              "prevMissing": true,
              "doc": "〔2026〕62号",
              "source": "http://hrss.henan.gov.cn/2026/10-10/3435886.html",
              "title": "河南省人力资源和社会保障厅 河南省医疗保障局 河南省财政厅 国家税务总局河南省税务局关于公布",
              "via": "http",
              "segments": [
                {
                  "from": "2026-07-01",
                  "to": "2027-06-30",
                  "min": 3912,
                  "max": 19560,
                  "status": "verified"
                }
              ]
            },
            "segments": [
              {
                "from": "2026-07-01",
                "to": "2027-06-30",
                "min": 3912,
                "max": 19560,
                "status": "verified"
              }
            ]
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "濮阳",
          "name": "濮阳",
          "province": "河南省",
          "social": {
            "prev": {
              "min": 3912,
              "max": 19560
            },
            "curr": {
              "min": 3912,
              "max": 19560
            },
            "adjustMonth": 7,
            "meta": {
              "status": "official",
              "checkedAt": "2026-11-23T11:48:58.373Z",
              "from": "2026-07-01",
              "to": "2027-06-30",
              "basisYear": 2025,
              "prevMissing": true,
              "doc": "〔2026〕62号",
              "source": "http://hrss.henan.gov.cn/2026/10-10/3435886.html",
              "title": "河南省人力资源和社会保障厅 河南省医疗保障局 河南省财政厅 国家税务总局河南省税务局关于公布",
              "via": "http",
              "segments": [
                {
                  "from": "2026-07-01",
                  "to": "2027-06-30",
                  "min": 3912,
                  "max": 19560,
                  "status": "verified"
                }
              ]
            },
            "segments": [
              {
                "from": "2026-07-01",
                "to": "2027-06-30",
                "min": 3912,
                "max": 19560,
                "status": "verified"
              }
            ]
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "许昌",
          "name": "许昌",
          "province": "河南省",
          "social": {
            "prev": {
              "min": 3912,
              "max": 19560
            },
            "curr": {
              "min": 3912,
              "max": 19560
            },
            "adjustMonth": 7,
            "meta": {
              "status": "official",
              "checkedAt": "2026-11-23T11:48:58.373Z",
              "from": "2026-07-01",
              "to": "2027-06-30",
              "basisYear": 2025,
              "prevMissing": true,
              "doc": "〔2026〕62号",
              "source": "http://hrss.henan.gov.cn/2026/10-10/3435886.html",
              "title": "河南省人力资源和社会保障厅 河南省医疗保障局 河南省财政厅 国家税务总局河南省税务局关于公布",
              "via": "http",
              "segments": [
                {
                  "from": "2026-07-01",
                  "to": "2027-06-30",
                  "min": 3912,
                  "max": 19560,
                  "status": "verified"
                }
              ]
            },
            "segments": [
              {
                "from": "2026-07-01",
                "to": "2027-06-30",
                "min": 3912,
                "max": 19560,
                "status": "verified"
              }
            ]
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "漯河",
          "name": "漯河",
          "province": "河南省",
          "social": {
            "prev": {
              "min": 3912,
              "max": 19560
            },
            "curr": {
              "min": 3912,
              "max": 19560
            },
            "adjustMonth": 7,
            "meta": {
              "status": "official",
              "checkedAt": "2026-11-23T11:48:58.373Z",
              "from": "2026-07-01",
              "to": "2027-06-30",
              "basisYear": 2025,
              "prevMissing": true,
              "doc": "〔2026〕62号",
              "source": "http://hrss.henan.gov.cn/2026/10-10/3435886.html",
              "title": "河南省人力资源和社会保障厅 河南省医疗保障局 河南省财政厅 国家税务总局河南省税务局关于公布",
              "via": "http",
              "segments": [
                {
                  "from": "2026-07-01",
                  "to": "2027-06-30",
                  "min": 3912,
                  "max": 19560,
                  "status": "verified"
                }
              ]
            },
            "segments": [
              {
                "from": "2026-07-01",
                "to": "2027-06-30",
                "min": 3912,
                "max": 19560,
                "status": "verified"
              }
            ]
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "三门峡",
          "name": "三门峡",
          "province": "河南省",
          "social": {
            "prev": {
              "min": 3912,
              "max": 19560
            },
            "curr": {
              "min": 3912,
              "max": 19560
            },
            "adjustMonth": 7,
            "meta": {
              "status": "official",
              "checkedAt": "2026-11-23T11:48:58.373Z",
              "from": "2026-07-01",
              "to": "2027-06-30",
              "basisYear": 2025,
              "prevMissing": true,
              "doc": "〔2026〕62号",
              "source": "http://hrss.henan.gov.cn/2026/10-10/3435886.html",
              "title": "河南省人力资源和社会保障厅 河南省医疗保障局 河南省财政厅 国家税务总局河南省税务局关于公布",
              "via": "http",
              "segments": [
                {
                  "from": "2026-07-01",
                  "to": "2027-06-30",
                  "min": 3912,
                  "max": 19560,
                  "status": "verified"
                }
              ]
            },
            "segments": [
              {
                "from": "2026-07-01",
                "to": "2027-06-30",
                "min": 3912,
                "max": 19560,
                "status": "verified"
              }
            ]
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "南阳",
          "name": "南阳",
          "province": "河南省",
          "social": {
            "prev": {
              "min": 3912,
              "max": 19560
            },
            "curr": {
              "min": 3912,
              "max": 19560
            },
            "adjustMonth": 7,
            "meta": {
              "status": "official",
              "checkedAt": "2026-11-23T11:48:58.373Z",
              "from": "2026-07-01",
              "to": "2027-06-30",
              "basisYear": 2025,
              "prevMissing": true,
              "doc": "〔2026〕62号",
              "source": "http://hrss.henan.gov.cn/2026/10-10/3435886.html",
              "title": "河南省人力资源和社会保障厅 河南省医疗保障局 河南省财政厅 国家税务总局河南省税务局关于公布",
              "via": "http",
              "segments": [
                {
                  "from": "2026-07-01",
                  "to": "2027-06-30",
                  "min": 3912,
                  "max": 19560,
                  "status": "verified"
                }
              ]
            },
            "segments": [
              {
                "from": "2026-07-01",
                "to": "2027-06-30",
                "min": 3912,
                "max": 19560,
                "status": "verified"
              }
            ]
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "商丘",
          "name": "商丘",
          "province": "河南省",
          "social": {
            "prev": {
              "min": 3912,
              "max": 19560
            },
            "curr": {
              "min": 3912,
              "max": 19560
            },
            "adjustMonth": 7,
            "meta": {
              "status": "official",
              "checkedAt": "2026-11-23T11:48:58.373Z",
              "from": "2026-07-01",
              "to": "2027-06-30",
              "basisYear": 2025,
              "prevMissing": true,
              "doc": "〔2026〕62号",
              "source": "http://hrss.henan.gov.cn/2026/10-10/3435886.html",
              "title": "河南省人力资源和社会保障厅 河南省医疗保障局 河南省财政厅 国家税务总局河南省税务局关于公布",
              "via": "http",
              "segments": [
                {
                  "from": "2026-07-01",
                  "to": "2027-06-30",
                  "min": 3912,
                  "max": 19560,
                  "status": "verified"
                }
              ]
            },
            "segments": [
              {
                "from": "2026-07-01",
                "to": "2027-06-30",
                "min": 3912,
                "max": 19560,
                "status": "verified"
              }
            ]
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "信阳",
          "name": "信阳",
          "province": "河南省",
          "social": {
            "prev": {
              "min": 3912,
              "max": 19560
            },
            "curr": {
              "min": 3912,
              "max": 19560
            },
            "adjustMonth": 7,
            "meta": {
              "status": "official",
              "checkedAt": "2026-11-23T11:48:58.373Z",
              "from": "2026-07-01",
              "to": "2027-06-30",
              "basisYear": 2025,
              "prevMissing": true,
              "doc": "〔2026〕62号",
              "source": "http://hrss.henan.gov.cn/2026/10-10/3435886.html",
              "title": "河南省人力资源和社会保障厅 河南省医疗保障局 河南省财政厅 国家税务总局河南省税务局关于公布",
              "via": "http",
              "segments": [
                {
                  "from": "2026-07-01",
                  "to": "2027-06-30",
                  "min": 3912,
                  "max": 19560,
                  "status": "verified"
                }
              ]
            },
            "segments": [
              {
                "from": "2026-07-01",
                "to": "2027-06-30",
                "min": 3912,
                "max": 19560,
                "status": "verified"
              }
            ]
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "周口",
          "name": "周口",
          "province": "河南省",
          "social": {
            "prev": {
              "min": 3912,
              "max": 19560
            },
            "curr": {
              "min": 3912,
              "max": 19560
            },
            "adjustMonth": 7,
            "meta": {
              "status": "official",
              "checkedAt": "2026-11-23T11:48:58.373Z",
              "from": "2026-07-01",
              "to": "2027-06-30",
              "basisYear": 2025,
              "prevMissing": true,
              "doc": "〔2026〕62号",
              "source": "http://hrss.henan.gov.cn/2026/10-10/3435886.html",
              "title": "河南省人力资源和社会保障厅 河南省医疗保障局 河南省财政厅 国家税务总局河南省税务局关于公布",
              "via": "http",
              "segments": [
                {
                  "from": "2026-07-01",
                  "to": "2027-06-30",
                  "min": 3912,
                  "max": 19560,
                  "status": "verified"
                }
              ]
            },
            "segments": [
              {
                "from": "2026-07-01",
                "to": "2027-06-30",
                "min": 3912,
                "max": 19560,
                "status": "verified"
              }
            ]
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "驻马店",
          "name": "驻马店",
          "province": "河南省",
          "social": {
            "prev": {
              "min": 3912,
              "max": 19560
            },
            "curr": {
              "min": 3912,
              "max": 19560
            },
            "adjustMonth": 7,
            "meta": {
              "status": "official",
              "checkedAt": "2026-11-23T11:48:58.373Z",
              "from": "2026-07-01",
              "to": "2027-06-30",
              "basisYear": 2025,
              "prevMissing": true,
              "doc": "〔2026〕62号",
              "source": "http://hrss.henan.gov.cn/2026/10-10/3435886.html",
              "title": "河南省人力资源和社会保障厅 河南省医疗保障局 河南省财政厅 国家税务总局河南省税务局关于公布",
              "via": "http",
              "segments": [
                {
                  "from": "2026-07-01",
                  "to": "2027-06-30",
                  "min": 3912,
                  "max": 19560,
                  "status": "verified"
                }
              ]
            },
            "segments": [
              {
                "from": "2026-07-01",
                "to": "2027-06-30",
                "min": 3912,
                "max": 19560,
                "status": "verified"
              }
            ]
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "济源",
          "name": "济源",
          "province": "河南省",
          "social": {
            "prev": {
              "min": 3912,
              "max": 19560
            },
            "curr": {
              "min": 3912,
              "max": 19560
            },
            "adjustMonth": 7,
            "meta": {
              "status": "official",
              "checkedAt": "2026-11-23T11:48:58.373Z",
              "from": "2026-07-01",
              "to": "2027-06-30",
              "basisYear": 2025,
              "prevMissing": true,
              "doc": "〔2026〕62号",
              "source": "http://hrss.henan.gov.cn/2026/10-10/3435886.html",
              "title": "河南省人力资源和社会保障厅 河南省医疗保障局 河南省财政厅 国家税务总局河南省税务局关于公布",
              "via": "http",
              "segments": [
                {
                  "from": "2026-07-01",
                  "to": "2027-06-30",
                  "min": 3912,
                  "max": 19560,
                  "status": "verified"
                }
              ]
            },
            "segments": [
              {
                "from": "2026-07-01",
                "to": "2027-06-30",
                "min": 3912,
                "max": 19560,
                "status": "verified"
              }
            ]
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        }
      ]
    },
    {
      "name": "湖北省",
      "social": [
        4498,
        22488,
        4552,
        22761,
        7
      ],
      "socialMeta": {
        "status": "legacy",
        "checkedAt": null
      },
      "cities": [
        {
          "id": "武汉",
          "name": "武汉",
          "province": "湖北省",
          "social": {
            "prev": {
              "min": 4498,
              "max": 22488
            },
            "curr": {
              "min": 4552,
              "max": 22761
            },
            "adjustMonth": 7,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": {
            "prev": {
              "min": 2210,
              "max": 34560.25
            },
            "curr": {
              "min": 2400,
              "max": 36072
            },
            "adjustMonth": 7,
            "note": "",
            "meta": {
              "status": "legacy",
              "checkedAt": null,
              "note": ""
            },
            "segments": []
          },
          "housingRates": [
            0.05,
            0.12
          ],
          "lat": 30.5928,
          "lng": 114.3055
        },
        {
          "id": "黄石",
          "name": "黄石",
          "province": "湖北省",
          "social": {
            "prev": {
              "min": 4498,
              "max": 22488
            },
            "curr": {
              "min": 4552,
              "max": 22761
            },
            "adjustMonth": 7,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "十堰",
          "name": "十堰",
          "province": "湖北省",
          "social": {
            "prev": {
              "min": 4498,
              "max": 22488
            },
            "curr": {
              "min": 4552,
              "max": 22761
            },
            "adjustMonth": 7,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "宜昌",
          "name": "宜昌",
          "province": "湖北省",
          "social": {
            "prev": {
              "min": 4498,
              "max": 22488
            },
            "curr": {
              "min": 4552,
              "max": 22761
            },
            "adjustMonth": 7,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "襄阳",
          "name": "襄阳",
          "province": "湖北省",
          "social": {
            "prev": {
              "min": 4498,
              "max": 22488
            },
            "curr": {
              "min": 4552,
              "max": 22761
            },
            "adjustMonth": 7,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "鄂州",
          "name": "鄂州",
          "province": "湖北省",
          "social": {
            "prev": {
              "min": 4498,
              "max": 22488
            },
            "curr": {
              "min": 4552,
              "max": 22761
            },
            "adjustMonth": 7,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "荆门",
          "name": "荆门",
          "province": "湖北省",
          "social": {
            "prev": {
              "min": 4498,
              "max": 22488
            },
            "curr": {
              "min": 4552,
              "max": 22761
            },
            "adjustMonth": 7,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "孝感",
          "name": "孝感",
          "province": "湖北省",
          "social": {
            "prev": {
              "min": 4498,
              "max": 22488
            },
            "curr": {
              "min": 4552,
              "max": 22761
            },
            "adjustMonth": 7,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "荆州",
          "name": "荆州",
          "province": "湖北省",
          "social": {
            "prev": {
              "min": 4498,
              "max": 22488
            },
            "curr": {
              "min": 4552,
              "max": 22761
            },
            "adjustMonth": 7,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "黄冈",
          "name": "黄冈",
          "province": "湖北省",
          "social": {
            "prev": {
              "min": 4498,
              "max": 22488
            },
            "curr": {
              "min": 4552,
              "max": 22761
            },
            "adjustMonth": 7,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "咸宁",
          "name": "咸宁",
          "province": "湖北省",
          "social": {
            "prev": {
              "min": 4498,
              "max": 22488
            },
            "curr": {
              "min": 4552,
              "max": 22761
            },
            "adjustMonth": 7,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "随州",
          "name": "随州",
          "province": "湖北省",
          "social": {
            "prev": {
              "min": 4498,
              "max": 22488
            },
            "curr": {
              "min": 4552,
              "max": 22761
            },
            "adjustMonth": 7,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "恩施",
          "name": "恩施",
          "province": "湖北省",
          "social": {
            "prev": {
              "min": 4498,
              "max": 22488
            },
            "curr": {
              "min": 4552,
              "max": 22761
            },
            "adjustMonth": 7,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        }
      ]
    },
    {
      "name": "湖南省",
      "social": [
        4072,
        20361,
        4106,
        20529,
        1
      ],
      "socialMeta": {
        "status": "legacy",
        "checkedAt": null
      },
      "cities": [
        {
          "id": "长沙",
          "name": "长沙",
          "province": "湖南省",
          "social": {
            "prev": {
              "min": 4072,
              "max": 20361
            },
            "curr": {
              "min": 4106,
              "max": 20529
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": {
            "prev": {
              "min": 2100,
              "max": 31291
            },
            "curr": {
              "min": 2200,
              "max": 32744
            },
            "adjustMonth": 7,
            "note": "",
            "meta": {
              "status": "legacy",
              "checkedAt": null,
              "note": ""
            },
            "segments": []
          },
          "housingRates": [
            0.05,
            0.12
          ],
          "lat": 28.2282,
          "lng": 112.9388
        },
        {
          "id": "株洲",
          "name": "株洲",
          "province": "湖南省",
          "social": {
            "prev": {
              "min": 4072,
              "max": 20361
            },
            "curr": {
              "min": 4106,
              "max": 20529
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "湘潭",
          "name": "湘潭",
          "province": "湖南省",
          "social": {
            "prev": {
              "min": 4072,
              "max": 20361
            },
            "curr": {
              "min": 4106,
              "max": 20529
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "衡阳",
          "name": "衡阳",
          "province": "湖南省",
          "social": {
            "prev": {
              "min": 4072,
              "max": 20361
            },
            "curr": {
              "min": 4106,
              "max": 20529
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "邵阳",
          "name": "邵阳",
          "province": "湖南省",
          "social": {
            "prev": {
              "min": 4072,
              "max": 20361
            },
            "curr": {
              "min": 4106,
              "max": 20529
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "岳阳",
          "name": "岳阳",
          "province": "湖南省",
          "social": {
            "prev": {
              "min": 4072,
              "max": 20361
            },
            "curr": {
              "min": 4106,
              "max": 20529
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "常德",
          "name": "常德",
          "province": "湖南省",
          "social": {
            "prev": {
              "min": 4072,
              "max": 20361
            },
            "curr": {
              "min": 4106,
              "max": 20529
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "张家界",
          "name": "张家界",
          "province": "湖南省",
          "social": {
            "prev": {
              "min": 4072,
              "max": 20361
            },
            "curr": {
              "min": 4106,
              "max": 20529
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "益阳",
          "name": "益阳",
          "province": "湖南省",
          "social": {
            "prev": {
              "min": 4072,
              "max": 20361
            },
            "curr": {
              "min": 4106,
              "max": 20529
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "郴州",
          "name": "郴州",
          "province": "湖南省",
          "social": {
            "prev": {
              "min": 4072,
              "max": 20361
            },
            "curr": {
              "min": 4106,
              "max": 20529
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "永州",
          "name": "永州",
          "province": "湖南省",
          "social": {
            "prev": {
              "min": 4072,
              "max": 20361
            },
            "curr": {
              "min": 4106,
              "max": 20529
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "怀化",
          "name": "怀化",
          "province": "湖南省",
          "social": {
            "prev": {
              "min": 4072,
              "max": 20361
            },
            "curr": {
              "min": 4106,
              "max": 20529
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "娄底",
          "name": "娄底",
          "province": "湖南省",
          "social": {
            "prev": {
              "min": 4072,
              "max": 20361
            },
            "curr": {
              "min": 4106,
              "max": 20529
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "湘西",
          "name": "湘西",
          "province": "湖南省",
          "social": {
            "prev": {
              "min": 4072,
              "max": 20361
            },
            "curr": {
              "min": 4106,
              "max": 20529
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        }
      ]
    },
    {
      "name": "广东省",
      "social": [
        5510,
        27549,
        5521,
        27603,
        7
      ],
      "socialMeta": {
        "status": "legacy",
        "checkedAt": null
      },
      "cities": [
        {
          "id": "广州",
          "name": "广州",
          "province": "广东省",
          "social": {
            "prev": {
              "min": 5510,
              "max": 27549
            },
            "curr": {
              "min": 5521,
              "max": 27603
            },
            "adjustMonth": 7,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": {
            "prev": {
              "min": 2500,
              "max": 39828
            },
            "curr": {
              "min": 2500,
              "max": 41697
            },
            "adjustMonth": 7,
            "note": "",
            "meta": {
              "status": "official",
              "checkedAt": "2026-11-23T11:41:19.378Z",
              "from": "2026-07-01",
              "to": "2027-06-30",
              "basisYear": 2025,
              "prevMissing": false,
              "doc": null,
              "source": "http://gjj.gz.gov.cn/gg/tzgg/content/post_10879601.html",
              "title": "首页 信息公开 工作动态 通知公告 办事服务 网上办事 下载中心 业务网点 互动交流 当前位",
              "via": "http",
              "segments": [
                {
                  "from": "2025-07-01",
                  "to": "2026-06-30",
                  "min": 2500,
                  "max": 39828,
                  "status": "verified"
                },
                {
                  "from": "2026-07-01",
                  "to": "2027-06-30",
                  "min": 2500,
                  "max": 41697,
                  "status": "verified"
                }
              ]
            },
            "segments": [
              {
                "from": "2025-07-01",
                "to": "2026-06-30",
                "min": 2500,
                "max": 39828,
                "status": "verified"
              },
              {
                "from": "2026-07-01",
                "to": "2027-06-30",
                "min": 2500,
                "max": 41697,
                "status": "verified"
              }
            ]
          },
          "housingRates": [
            0.05,
            0.12
          ],
          "lat": 23.1291,
          "lng": 113.2644
        },
        {
          "id": "韶关",
          "name": "韶关",
          "province": "广东省",
          "social": {
            "prev": {
              "min": 5510,
              "max": 27549
            },
            "curr": {
              "min": 5521,
              "max": 27603
            },
            "adjustMonth": 7,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": {
            "prev": {
              "min": 1750,
              "max": 29283
            },
            "curr": {
              "min": 1750,
              "max": 29283
            },
            "adjustMonth": 7,
            "note": "",
            "meta": {
              "status": "legacy",
              "checkedAt": null,
              "note": ""
            },
            "segments": []
          },
          "housingRates": [
            0.05,
            0.12
          ],
          "lat": 24.8107,
          "lng": 113.5975
        },
        {
          "id": "深圳",
          "name": "深圳",
          "province": "广东省",
          "social": {
            "prev": {
              "min": 5510,
              "max": 27549
            },
            "curr": {
              "min": 5521,
              "max": 27603
            },
            "adjustMonth": 7,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": {
            "prev": {
              "min": 2360,
              "max": 44265
            },
            "curr": {
              "min": 2360,
              "max": 44265
            },
            "adjustMonth": 7,
            "note": "2026未更新",
            "meta": {
              "status": "legacy",
              "checkedAt": null,
              "note": "2026未更新"
            },
            "segments": []
          },
          "housingRates": [
            0.05,
            0.12
          ],
          "lat": 22.5431,
          "lng": 114.0579
        },
        {
          "id": "珠海",
          "name": "珠海",
          "province": "广东省",
          "social": {
            "prev": {
              "min": 5510,
              "max": 27549
            },
            "curr": {
              "min": 5521,
              "max": 27603
            },
            "adjustMonth": 7,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": {
            "prev": {
              "min": 2080,
              "max": 36297
            },
            "curr": {
              "min": 2080,
              "max": 36297
            },
            "adjustMonth": 7,
            "note": "",
            "meta": {
              "status": "legacy",
              "checkedAt": null,
              "note": ""
            },
            "segments": []
          },
          "housingRates": [
            0.05,
            0.12
          ],
          "lat": 22.271,
          "lng": 113.5767
        },
        {
          "id": "汕头",
          "name": "汕头",
          "province": "广东省",
          "social": {
            "prev": {
              "min": 5510,
              "max": 27549
            },
            "curr": {
              "min": 5521,
              "max": 27603
            },
            "adjustMonth": 7,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "佛山",
          "name": "佛山",
          "province": "广东省",
          "social": {
            "prev": {
              "min": 5510,
              "max": 27549
            },
            "curr": {
              "min": 5521,
              "max": 27603
            },
            "adjustMonth": 7,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": {
            "prev": {
              "min": 2080,
              "max": 28959
            },
            "curr": {
              "min": 2080,
              "max": 28959
            },
            "adjustMonth": 7,
            "note": "2026未更新",
            "meta": {
              "status": "legacy",
              "checkedAt": null,
              "note": "2026未更新"
            },
            "segments": []
          },
          "housingRates": [
            0.05,
            0.12
          ],
          "lat": 23.0215,
          "lng": 113.1214
        },
        {
          "id": "江门",
          "name": "江门",
          "province": "广东省",
          "social": {
            "prev": {
              "min": 5510,
              "max": 27549
            },
            "curr": {
              "min": 5521,
              "max": 27603
            },
            "adjustMonth": 7,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "湛江",
          "name": "湛江",
          "province": "广东省",
          "social": {
            "prev": {
              "min": 5510,
              "max": 27549
            },
            "curr": {
              "min": 5521,
              "max": 27603
            },
            "adjustMonth": 7,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "茂名",
          "name": "茂名",
          "province": "广东省",
          "social": {
            "prev": {
              "min": 5510,
              "max": 27549
            },
            "curr": {
              "min": 5521,
              "max": 27603
            },
            "adjustMonth": 7,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "肇庆",
          "name": "肇庆",
          "province": "广东省",
          "social": {
            "prev": {
              "min": 5510,
              "max": 27549
            },
            "curr": {
              "min": 5521,
              "max": 27603
            },
            "adjustMonth": 7,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "惠州",
          "name": "惠州",
          "province": "广东省",
          "social": {
            "prev": {
              "min": 5510,
              "max": 27549
            },
            "curr": {
              "min": 5521,
              "max": 27603
            },
            "adjustMonth": 7,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "梅州",
          "name": "梅州",
          "province": "广东省",
          "social": {
            "prev": {
              "min": 5510,
              "max": 27549
            },
            "curr": {
              "min": 5521,
              "max": 27603
            },
            "adjustMonth": 7,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "汕尾",
          "name": "汕尾",
          "province": "广东省",
          "social": {
            "prev": {
              "min": 5510,
              "max": 27549
            },
            "curr": {
              "min": 5521,
              "max": 27603
            },
            "adjustMonth": 7,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "河源",
          "name": "河源",
          "province": "广东省",
          "social": {
            "prev": {
              "min": 5510,
              "max": 27549
            },
            "curr": {
              "min": 5521,
              "max": 27603
            },
            "adjustMonth": 7,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "阳江",
          "name": "阳江",
          "province": "广东省",
          "social": {
            "prev": {
              "min": 5510,
              "max": 27549
            },
            "curr": {
              "min": 5521,
              "max": 27603
            },
            "adjustMonth": 7,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "清远",
          "name": "清远",
          "province": "广东省",
          "social": {
            "prev": {
              "min": 5510,
              "max": 27549
            },
            "curr": {
              "min": 5521,
              "max": 27603
            },
            "adjustMonth": 7,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "东莞",
          "name": "东莞",
          "province": "广东省",
          "social": {
            "prev": {
              "min": 5510,
              "max": 27549
            },
            "curr": {
              "min": 5521,
              "max": 27603
            },
            "adjustMonth": 7,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": {
            "prev": {
              "min": 2080,
              "max": 27391
            },
            "curr": {
              "min": 2080,
              "max": 27391
            },
            "adjustMonth": 7,
            "note": "2026未更新",
            "meta": {
              "status": "legacy",
              "checkedAt": null,
              "note": "2026未更新"
            },
            "segments": []
          },
          "housingRates": [
            0.05,
            0.12
          ],
          "lat": 23.0207,
          "lng": 113.7518
        },
        {
          "id": "中山",
          "name": "中山",
          "province": "广东省",
          "social": {
            "prev": {
              "min": 5510,
              "max": 27549
            },
            "curr": {
              "min": 5521,
              "max": 27603
            },
            "adjustMonth": 7,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": {
            "prev": {
              "min": 2080,
              "max": 29430
            },
            "curr": {
              "min": 2080,
              "max": 29430
            },
            "adjustMonth": 7,
            "note": "",
            "meta": {
              "status": "legacy",
              "checkedAt": null,
              "note": ""
            },
            "segments": []
          },
          "housingRates": [
            0.05,
            0.12
          ],
          "lat": 22.5176,
          "lng": 113.3928
        },
        {
          "id": "潮州",
          "name": "潮州",
          "province": "广东省",
          "social": {
            "prev": {
              "min": 5510,
              "max": 27549
            },
            "curr": {
              "min": 5521,
              "max": 27603
            },
            "adjustMonth": 7,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "揭阳",
          "name": "揭阳",
          "province": "广东省",
          "social": {
            "prev": {
              "min": 5510,
              "max": 27549
            },
            "curr": {
              "min": 5521,
              "max": 27603
            },
            "adjustMonth": 7,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "云浮",
          "name": "云浮",
          "province": "广东省",
          "social": {
            "prev": {
              "min": 5510,
              "max": 27549
            },
            "curr": {
              "min": 5521,
              "max": 27603
            },
            "adjustMonth": 7,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        }
      ]
    },
    {
      "name": "广西壮族自治区",
      "social": [
        4143,
        20715,
        4204.8,
        21024,
        1
      ],
      "socialMeta": {
        "status": "legacy",
        "checkedAt": null
      },
      "cities": [
        {
          "id": "南宁",
          "name": "南宁",
          "province": "广西壮族自治区",
          "social": {
            "prev": {
              "min": 4143,
              "max": 20715
            },
            "curr": {
              "min": 4204.8,
              "max": 21024
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": {
            "prev": {
              "min": 2200,
              "max": 29277
            },
            "curr": {
              "min": 2200,
              "max": 29277
            },
            "adjustMonth": 1,
            "note": "",
            "meta": {
              "status": "official",
              "checkedAt": "2026-11-23T11:41:19.378Z",
              "from": "2026-01-01",
              "to": "2026-12-31",
              "basisYear": 2025,
              "prevMissing": false,
              "doc": null,
              "source": "https://gjj.nanning.gov.cn/xxgk/zdxzjchgfxwj/t6746601.html",
              "title": "无障碍 首页 网上办事大厅 单位网厅 个人网厅 网厅售房企业版 政府信息公开 政府信息公开指",
              "via": "http",
              "segments": [
                {
                  "from": "2025-01-01",
                  "to": "2025-12-31",
                  "min": 2200,
                  "max": 28020,
                  "status": "verified"
                },
                {
                  "from": "2026-01-01",
                  "to": "2026-12-31",
                  "min": 2200,
                  "max": 29277,
                  "status": "verified"
                }
              ]
            },
            "segments": [
              {
                "from": "2025-01-01",
                "to": "2025-12-31",
                "min": 2200,
                "max": 28020,
                "status": "verified"
              },
              {
                "from": "2026-01-01",
                "to": "2026-12-31",
                "min": 2200,
                "max": 29277,
                "status": "verified"
              }
            ]
          },
          "housingRates": [
            0.05,
            0.12
          ],
          "lat": 22.817,
          "lng": 108.3665
        },
        {
          "id": "柳州",
          "name": "柳州",
          "province": "广西壮族自治区",
          "social": {
            "prev": {
              "min": 4143,
              "max": 20715
            },
            "curr": {
              "min": 4204.8,
              "max": 21024
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "桂林",
          "name": "桂林",
          "province": "广西壮族自治区",
          "social": {
            "prev": {
              "min": 4143,
              "max": 20715
            },
            "curr": {
              "min": 4204.8,
              "max": 21024
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "梧州",
          "name": "梧州",
          "province": "广西壮族自治区",
          "social": {
            "prev": {
              "min": 4143,
              "max": 20715
            },
            "curr": {
              "min": 4204.8,
              "max": 21024
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "北海",
          "name": "北海",
          "province": "广西壮族自治区",
          "social": {
            "prev": {
              "min": 4143,
              "max": 20715
            },
            "curr": {
              "min": 4204.8,
              "max": 21024
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "防城港",
          "name": "防城港",
          "province": "广西壮族自治区",
          "social": {
            "prev": {
              "min": 4143,
              "max": 20715
            },
            "curr": {
              "min": 4204.8,
              "max": 21024
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "钦州",
          "name": "钦州",
          "province": "广西壮族自治区",
          "social": {
            "prev": {
              "min": 4143,
              "max": 20715
            },
            "curr": {
              "min": 4204.8,
              "max": 21024
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "贵港",
          "name": "贵港",
          "province": "广西壮族自治区",
          "social": {
            "prev": {
              "min": 4143,
              "max": 20715
            },
            "curr": {
              "min": 4204.8,
              "max": 21024
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "玉林",
          "name": "玉林",
          "province": "广西壮族自治区",
          "social": {
            "prev": {
              "min": 4143,
              "max": 20715
            },
            "curr": {
              "min": 4204.8,
              "max": 21024
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "百色",
          "name": "百色",
          "province": "广西壮族自治区",
          "social": {
            "prev": {
              "min": 4143,
              "max": 20715
            },
            "curr": {
              "min": 4204.8,
              "max": 21024
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "贺州",
          "name": "贺州",
          "province": "广西壮族自治区",
          "social": {
            "prev": {
              "min": 4143,
              "max": 20715
            },
            "curr": {
              "min": 4204.8,
              "max": 21024
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "河池",
          "name": "河池",
          "province": "广西壮族自治区",
          "social": {
            "prev": {
              "min": 4143,
              "max": 20715
            },
            "curr": {
              "min": 4204.8,
              "max": 21024
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "来宾",
          "name": "来宾",
          "province": "广西壮族自治区",
          "social": {
            "prev": {
              "min": 4143,
              "max": 20715
            },
            "curr": {
              "min": 4204.8,
              "max": 21024
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "崇左",
          "name": "崇左",
          "province": "广西壮族自治区",
          "social": {
            "prev": {
              "min": 4143,
              "max": 20715
            },
            "curr": {
              "min": 4204.8,
              "max": 21024
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        }
      ]
    },
    {
      "name": "海南省",
      "social": [
        4912.8,
        24564,
        4952.4,
        24762,
        7
      ],
      "socialMeta": {
        "status": "legacy",
        "checkedAt": null
      },
      "cities": [
        {
          "id": "海口",
          "name": "海口",
          "province": "海南省",
          "social": {
            "prev": {
              "min": 4912.8,
              "max": 24564
            },
            "curr": {
              "min": 4952.4,
              "max": 24762
            },
            "adjustMonth": 7,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": {
            "prev": {
              "min": 2250,
              "max": 30253
            },
            "curr": {
              "min": 2250,
              "max": 30253
            },
            "adjustMonth": 7,
            "note": "",
            "meta": {
              "status": "legacy",
              "checkedAt": null,
              "note": ""
            },
            "segments": []
          },
          "housingRates": [
            0.05,
            0.12
          ],
          "lat": 20.0444,
          "lng": 110.1999
        },
        {
          "id": "三亚",
          "name": "三亚",
          "province": "海南省",
          "social": {
            "prev": {
              "min": 4912.8,
              "max": 24564
            },
            "curr": {
              "min": 4952.4,
              "max": 24762
            },
            "adjustMonth": 7,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "三沙",
          "name": "三沙",
          "province": "海南省",
          "social": {
            "prev": {
              "min": 4912.8,
              "max": 24564
            },
            "curr": {
              "min": 4952.4,
              "max": 24762
            },
            "adjustMonth": 7,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "儋州",
          "name": "儋州",
          "province": "海南省",
          "social": {
            "prev": {
              "min": 4912.8,
              "max": 24564
            },
            "curr": {
              "min": 4952.4,
              "max": 24762
            },
            "adjustMonth": 7,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        }
      ]
    },
    {
      "name": "四川省",
      "social": [
        4588,
        22938,
        4699,
        23493,
        1
      ],
      "socialMeta": {
        "status": "legacy",
        "checkedAt": null
      },
      "cities": [
        {
          "id": "成都",
          "name": "成都",
          "province": "四川省",
          "social": {
            "prev": {
              "min": 4588,
              "max": 22938
            },
            "curr": {
              "min": 4699,
              "max": 23493
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": {
            "prev": {
              "min": 2330,
              "max": 32969
            },
            "curr": {
              "min": 2330,
              "max": 32969
            },
            "adjustMonth": 1,
            "note": "",
            "meta": {
              "status": "official",
              "checkedAt": "2026-11-23T11:41:19.378Z",
              "from": "2026-01-01",
              "to": "2026-12-31",
              "basisYear": 2025,
              "prevMissing": false,
              "doc": "成公积金委〔2026〕5号",
              "source": "https://cdzfgjj.chengdu.gov.cn/cdgjj/c1156365/2026-07/31/content_d0fc769d206943f99514a012d02bb981.shtml",
              "title": "网站首页 政务公开 政府信息公开 中心概况 机构职能 领导分工 组织机构 法制信息 普法工作",
              "via": "cdp",
              "segments": [
                {
                  "from": "2026-01-01",
                  "to": "2026-12-31",
                  "min": 2330,
                  "max": 32969,
                  "status": "verified"
                }
              ]
            },
            "segments": [
              {
                "from": "2026-01-01",
                "to": "2026-12-31",
                "min": 2330,
                "max": 32969,
                "status": "verified"
              }
            ]
          },
          "housingRates": [
            0.05,
            0.12
          ],
          "lat": 30.5728,
          "lng": 104.0668
        },
        {
          "id": "自贡",
          "name": "自贡",
          "province": "四川省",
          "social": {
            "prev": {
              "min": 4588,
              "max": 22938
            },
            "curr": {
              "min": 4699,
              "max": 23493
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "攀枝花",
          "name": "攀枝花",
          "province": "四川省",
          "social": {
            "prev": {
              "min": 4588,
              "max": 22938
            },
            "curr": {
              "min": 4699,
              "max": 23493
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "泸州",
          "name": "泸州",
          "province": "四川省",
          "social": {
            "prev": {
              "min": 4588,
              "max": 22938
            },
            "curr": {
              "min": 4699,
              "max": 23493
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "德阳",
          "name": "德阳",
          "province": "四川省",
          "social": {
            "prev": {
              "min": 4588,
              "max": 22938
            },
            "curr": {
              "min": 4699,
              "max": 23493
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "绵阳",
          "name": "绵阳",
          "province": "四川省",
          "social": {
            "prev": {
              "min": 4588,
              "max": 22938
            },
            "curr": {
              "min": 4699,
              "max": 23493
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "广元",
          "name": "广元",
          "province": "四川省",
          "social": {
            "prev": {
              "min": 4588,
              "max": 22938
            },
            "curr": {
              "min": 4699,
              "max": 23493
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "遂宁",
          "name": "遂宁",
          "province": "四川省",
          "social": {
            "prev": {
              "min": 4588,
              "max": 22938
            },
            "curr": {
              "min": 4699,
              "max": 23493
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "内江",
          "name": "内江",
          "province": "四川省",
          "social": {
            "prev": {
              "min": 4588,
              "max": 22938
            },
            "curr": {
              "min": 4699,
              "max": 23493
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "乐山",
          "name": "乐山",
          "province": "四川省",
          "social": {
            "prev": {
              "min": 4588,
              "max": 22938
            },
            "curr": {
              "min": 4699,
              "max": 23493
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "南充",
          "name": "南充",
          "province": "四川省",
          "social": {
            "prev": {
              "min": 4588,
              "max": 22938
            },
            "curr": {
              "min": 4699,
              "max": 23493
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "眉山",
          "name": "眉山",
          "province": "四川省",
          "social": {
            "prev": {
              "min": 4588,
              "max": 22938
            },
            "curr": {
              "min": 4699,
              "max": 23493
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "宜宾",
          "name": "宜宾",
          "province": "四川省",
          "social": {
            "prev": {
              "min": 4588,
              "max": 22938
            },
            "curr": {
              "min": 4699,
              "max": 23493
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "广安",
          "name": "广安",
          "province": "四川省",
          "social": {
            "prev": {
              "min": 4588,
              "max": 22938
            },
            "curr": {
              "min": 4699,
              "max": 23493
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "达州",
          "name": "达州",
          "province": "四川省",
          "social": {
            "prev": {
              "min": 4588,
              "max": 22938
            },
            "curr": {
              "min": 4699,
              "max": 23493
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "雅安",
          "name": "雅安",
          "province": "四川省",
          "social": {
            "prev": {
              "min": 4588,
              "max": 22938
            },
            "curr": {
              "min": 4699,
              "max": 23493
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "巴中",
          "name": "巴中",
          "province": "四川省",
          "social": {
            "prev": {
              "min": 4588,
              "max": 22938
            },
            "curr": {
              "min": 4699,
              "max": 23493
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "资阳",
          "name": "资阳",
          "province": "四川省",
          "social": {
            "prev": {
              "min": 4588,
              "max": 22938
            },
            "curr": {
              "min": 4699,
              "max": 23493
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "阿坝",
          "name": "阿坝",
          "province": "四川省",
          "social": {
            "prev": {
              "min": 4588,
              "max": 22938
            },
            "curr": {
              "min": 4699,
              "max": 23493
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "甘孜",
          "name": "甘孜",
          "province": "四川省",
          "social": {
            "prev": {
              "min": 4588,
              "max": 22938
            },
            "curr": {
              "min": 4699,
              "max": 23493
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "凉山",
          "name": "凉山",
          "province": "四川省",
          "social": {
            "prev": {
              "min": 4588,
              "max": 22938
            },
            "curr": {
              "min": 4699,
              "max": 23493
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        }
      ]
    },
    {
      "name": "贵州省",
      "social": [
        4394.7,
        21973.5,
        4426.05,
        22130.25,
        1
      ],
      "socialMeta": {
        "status": "legacy",
        "checkedAt": null
      },
      "cities": [
        {
          "id": "贵阳",
          "name": "贵阳",
          "province": "贵州省",
          "social": {
            "prev": {
              "min": 4394.7,
              "max": 21973.5
            },
            "curr": {
              "min": 4426.05,
              "max": 22130.25
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": {
            "prev": {
              "min": 2130,
              "max": 25392
            },
            "curr": {
              "min": 2130,
              "max": 25392
            },
            "adjustMonth": 1,
            "note": "",
            "meta": {
              "status": "legacy",
              "checkedAt": null,
              "note": ""
            },
            "segments": []
          },
          "housingRates": [
            0.05,
            0.12
          ],
          "lat": 26.647,
          "lng": 106.6302
        },
        {
          "id": "六盘水",
          "name": "六盘水",
          "province": "贵州省",
          "social": {
            "prev": {
              "min": 4394.7,
              "max": 21973.5
            },
            "curr": {
              "min": 4426.05,
              "max": 22130.25
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "遵义",
          "name": "遵义",
          "province": "贵州省",
          "social": {
            "prev": {
              "min": 4394.7,
              "max": 21973.5
            },
            "curr": {
              "min": 4426.05,
              "max": 22130.25
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "安顺",
          "name": "安顺",
          "province": "贵州省",
          "social": {
            "prev": {
              "min": 4394.7,
              "max": 21973.5
            },
            "curr": {
              "min": 4426.05,
              "max": 22130.25
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "毕节",
          "name": "毕节",
          "province": "贵州省",
          "social": {
            "prev": {
              "min": 4394.7,
              "max": 21973.5
            },
            "curr": {
              "min": 4426.05,
              "max": 22130.25
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "铜仁",
          "name": "铜仁",
          "province": "贵州省",
          "social": {
            "prev": {
              "min": 4394.7,
              "max": 21973.5
            },
            "curr": {
              "min": 4426.05,
              "max": 22130.25
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "黔西南",
          "name": "黔西南",
          "province": "贵州省",
          "social": {
            "prev": {
              "min": 4394.7,
              "max": 21973.5
            },
            "curr": {
              "min": 4426.05,
              "max": 22130.25
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "黔东南",
          "name": "黔东南",
          "province": "贵州省",
          "social": {
            "prev": {
              "min": 4394.7,
              "max": 21973.5
            },
            "curr": {
              "min": 4426.05,
              "max": 22130.25
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "黔南",
          "name": "黔南",
          "province": "贵州省",
          "social": {
            "prev": {
              "min": 4394.7,
              "max": 21973.5
            },
            "curr": {
              "min": 4426.05,
              "max": 22130.25
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        }
      ]
    },
    {
      "name": "云南省",
      "social": [
        4357,
        21789,
        4403,
        22017,
        1
      ],
      "socialMeta": {
        "status": "legacy",
        "checkedAt": null
      },
      "cities": [
        {
          "id": "昆明",
          "name": "昆明",
          "province": "云南省",
          "social": {
            "prev": {
              "min": 4357,
              "max": 21789
            },
            "curr": {
              "min": 4403,
              "max": 22017
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": 25.0389,
          "lng": 102.7183
        },
        {
          "id": "曲靖",
          "name": "曲靖",
          "province": "云南省",
          "social": {
            "prev": {
              "min": 4357,
              "max": 21789
            },
            "curr": {
              "min": 4403,
              "max": 22017
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "玉溪",
          "name": "玉溪",
          "province": "云南省",
          "social": {
            "prev": {
              "min": 4357,
              "max": 21789
            },
            "curr": {
              "min": 4403,
              "max": 22017
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "保山",
          "name": "保山",
          "province": "云南省",
          "social": {
            "prev": {
              "min": 4357,
              "max": 21789
            },
            "curr": {
              "min": 4403,
              "max": 22017
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "昭通",
          "name": "昭通",
          "province": "云南省",
          "social": {
            "prev": {
              "min": 4357,
              "max": 21789
            },
            "curr": {
              "min": 4403,
              "max": 22017
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "丽江",
          "name": "丽江",
          "province": "云南省",
          "social": {
            "prev": {
              "min": 4357,
              "max": 21789
            },
            "curr": {
              "min": 4403,
              "max": 22017
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "普洱",
          "name": "普洱",
          "province": "云南省",
          "social": {
            "prev": {
              "min": 4357,
              "max": 21789
            },
            "curr": {
              "min": 4403,
              "max": 22017
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "临沧",
          "name": "临沧",
          "province": "云南省",
          "social": {
            "prev": {
              "min": 4357,
              "max": 21789
            },
            "curr": {
              "min": 4403,
              "max": 22017
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "楚雄",
          "name": "楚雄",
          "province": "云南省",
          "social": {
            "prev": {
              "min": 4357,
              "max": 21789
            },
            "curr": {
              "min": 4403,
              "max": 22017
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "红河",
          "name": "红河",
          "province": "云南省",
          "social": {
            "prev": {
              "min": 4357,
              "max": 21789
            },
            "curr": {
              "min": 4403,
              "max": 22017
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "文山",
          "name": "文山",
          "province": "云南省",
          "social": {
            "prev": {
              "min": 4357,
              "max": 21789
            },
            "curr": {
              "min": 4403,
              "max": 22017
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "西双版纳",
          "name": "西双版纳",
          "province": "云南省",
          "social": {
            "prev": {
              "min": 4357,
              "max": 21789
            },
            "curr": {
              "min": 4403,
              "max": 22017
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "大理",
          "name": "大理",
          "province": "云南省",
          "social": {
            "prev": {
              "min": 4357,
              "max": 21789
            },
            "curr": {
              "min": 4403,
              "max": 22017
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "德宏",
          "name": "德宏",
          "province": "云南省",
          "social": {
            "prev": {
              "min": 4357,
              "max": 21789
            },
            "curr": {
              "min": 4403,
              "max": 22017
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "怒江",
          "name": "怒江",
          "province": "云南省",
          "social": {
            "prev": {
              "min": 4357,
              "max": 21789
            },
            "curr": {
              "min": 4403,
              "max": 22017
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "迪庆",
          "name": "迪庆",
          "province": "云南省",
          "social": {
            "prev": {
              "min": 4357,
              "max": 21789
            },
            "curr": {
              "min": 4403,
              "max": 22017
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        }
      ]
    },
    {
      "name": "西藏自治区",
      "social": [
        7066.2,
        35331,
        7172.4,
        35862,
        1
      ],
      "socialMeta": {
        "status": "legacy",
        "checkedAt": null
      },
      "cities": [
        {
          "id": "拉萨",
          "name": "拉萨",
          "province": "西藏自治区",
          "social": {
            "prev": {
              "min": 7066.2,
              "max": 35331
            },
            "curr": {
              "min": 7172.4,
              "max": 35862
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": {
            "prev": {
              "min": 2360,
              "max": 42214
            },
            "curr": {
              "min": 2360,
              "max": 42214
            },
            "adjustMonth": 7,
            "note": "",
            "meta": {
              "status": "legacy",
              "checkedAt": null,
              "note": ""
            },
            "segments": []
          },
          "housingRates": [
            0.05,
            0.12
          ],
          "lat": 29.652,
          "lng": 91.1721
        },
        {
          "id": "日喀则",
          "name": "日喀则",
          "province": "西藏自治区",
          "social": {
            "prev": {
              "min": 7066.2,
              "max": 35331
            },
            "curr": {
              "min": 7172.4,
              "max": 35862
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "昌都",
          "name": "昌都",
          "province": "西藏自治区",
          "social": {
            "prev": {
              "min": 7066.2,
              "max": 35331
            },
            "curr": {
              "min": 7172.4,
              "max": 35862
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "林芝",
          "name": "林芝",
          "province": "西藏自治区",
          "social": {
            "prev": {
              "min": 7066.2,
              "max": 35331
            },
            "curr": {
              "min": 7172.4,
              "max": 35862
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "山南",
          "name": "山南",
          "province": "西藏自治区",
          "social": {
            "prev": {
              "min": 7066.2,
              "max": 35331
            },
            "curr": {
              "min": 7172.4,
              "max": 35862
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "那曲",
          "name": "那曲",
          "province": "西藏自治区",
          "social": {
            "prev": {
              "min": 7066.2,
              "max": 35331
            },
            "curr": {
              "min": 7172.4,
              "max": 35862
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "阿里",
          "name": "阿里",
          "province": "西藏自治区",
          "social": {
            "prev": {
              "min": 7066.2,
              "max": 35331
            },
            "curr": {
              "min": 7172.4,
              "max": 35862
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        }
      ]
    },
    {
      "name": "陕西省",
      "social": [
        4650,
        23250,
        4737,
        23685,
        7
      ],
      "socialMeta": {
        "status": "legacy",
        "checkedAt": null
      },
      "cities": [
        {
          "id": "西安",
          "name": "西安",
          "province": "陕西省",
          "social": {
            "prev": {
              "min": 4650,
              "max": 23250
            },
            "curr": {
              "min": 4737,
              "max": 23685
            },
            "adjustMonth": 7,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": {
            "prev": {
              "min": 2160,
              "max": 31761
            },
            "curr": {
              "min": 2376,
              "max": 32726
            },
            "adjustMonth": 7,
            "note": "",
            "meta": {
              "status": "suspect",
              "checkedAt": "2026-11-23T11:41:19.378Z",
              "from": "2026-07-01",
              "to": "2027-06-30",
              "basisYear": 2025,
              "prevMissing": false,
              "doc": null,
              "source": "https://zfgjj.xa.gov.cn/gzdt/tzgg/2070405479618592769.html",
              "title": "首页 工作动态 政府信息公开 政务服务 互动交流 首页 工作动态 政府信息公开 政务服务 互",
              "via": "http",
              "segments": [
                {
                  "from": "2025-07-01",
                  "to": "2026-06-30",
                  "min": 2160,
                  "max": 31761,
                  "status": "suspect"
                },
                {
                  "from": "2026-07-01",
                  "to": "2027-06-30",
                  "min": 2376,
                  "max": 32726,
                  "status": "suspect"
                }
              ]
            },
            "segments": [
              {
                "from": "2025-07-01",
                "to": "2026-06-30",
                "min": 2160,
                "max": 31761,
                "status": "suspect"
              },
              {
                "from": "2026-07-01",
                "to": "2027-06-30",
                "min": 2376,
                "max": 32726,
                "status": "suspect"
              }
            ]
          },
          "housingRates": [
            0.05,
            0.12
          ],
          "lat": 34.3416,
          "lng": 108.9398
        },
        {
          "id": "铜川",
          "name": "铜川",
          "province": "陕西省",
          "social": {
            "prev": {
              "min": 4650,
              "max": 23250
            },
            "curr": {
              "min": 4737,
              "max": 23685
            },
            "adjustMonth": 7,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "宝鸡",
          "name": "宝鸡",
          "province": "陕西省",
          "social": {
            "prev": {
              "min": 4650,
              "max": 23250
            },
            "curr": {
              "min": 4737,
              "max": 23685
            },
            "adjustMonth": 7,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "咸阳",
          "name": "咸阳",
          "province": "陕西省",
          "social": {
            "prev": {
              "min": 4650,
              "max": 23250
            },
            "curr": {
              "min": 4737,
              "max": 23685
            },
            "adjustMonth": 7,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "渭南",
          "name": "渭南",
          "province": "陕西省",
          "social": {
            "prev": {
              "min": 4650,
              "max": 23250
            },
            "curr": {
              "min": 4737,
              "max": 23685
            },
            "adjustMonth": 7,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "延安",
          "name": "延安",
          "province": "陕西省",
          "social": {
            "prev": {
              "min": 4650,
              "max": 23250
            },
            "curr": {
              "min": 4737,
              "max": 23685
            },
            "adjustMonth": 7,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "汉中",
          "name": "汉中",
          "province": "陕西省",
          "social": {
            "prev": {
              "min": 4650,
              "max": 23250
            },
            "curr": {
              "min": 4737,
              "max": 23685
            },
            "adjustMonth": 7,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "榆林",
          "name": "榆林",
          "province": "陕西省",
          "social": {
            "prev": {
              "min": 4650,
              "max": 23250
            },
            "curr": {
              "min": 4737,
              "max": 23685
            },
            "adjustMonth": 7,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "安康",
          "name": "安康",
          "province": "陕西省",
          "social": {
            "prev": {
              "min": 4650,
              "max": 23250
            },
            "curr": {
              "min": 4737,
              "max": 23685
            },
            "adjustMonth": 7,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "商洛",
          "name": "商洛",
          "province": "陕西省",
          "social": {
            "prev": {
              "min": 4650,
              "max": 23250
            },
            "curr": {
              "min": 4737,
              "max": 23685
            },
            "adjustMonth": 7,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        }
      ]
    },
    {
      "name": "甘肃省",
      "social": [
        4403,
        22014,
        4526,
        22626,
        1
      ],
      "socialMeta": {
        "status": "legacy",
        "checkedAt": null
      },
      "cities": [
        {
          "id": "兰州",
          "name": "兰州",
          "province": "甘肃省",
          "social": {
            "prev": {
              "min": 4403,
              "max": 22014
            },
            "curr": {
              "min": 4526,
              "max": 22626
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": 36.0611,
          "lng": 103.8343
        },
        {
          "id": "嘉峪关",
          "name": "嘉峪关",
          "province": "甘肃省",
          "social": {
            "prev": {
              "min": 4403,
              "max": 22014
            },
            "curr": {
              "min": 4526,
              "max": 22626
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "金昌",
          "name": "金昌",
          "province": "甘肃省",
          "social": {
            "prev": {
              "min": 4403,
              "max": 22014
            },
            "curr": {
              "min": 4526,
              "max": 22626
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "白银",
          "name": "白银",
          "province": "甘肃省",
          "social": {
            "prev": {
              "min": 4403,
              "max": 22014
            },
            "curr": {
              "min": 4526,
              "max": 22626
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "天水",
          "name": "天水",
          "province": "甘肃省",
          "social": {
            "prev": {
              "min": 4403,
              "max": 22014
            },
            "curr": {
              "min": 4526,
              "max": 22626
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "武威",
          "name": "武威",
          "province": "甘肃省",
          "social": {
            "prev": {
              "min": 4403,
              "max": 22014
            },
            "curr": {
              "min": 4526,
              "max": 22626
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "张掖",
          "name": "张掖",
          "province": "甘肃省",
          "social": {
            "prev": {
              "min": 4403,
              "max": 22014
            },
            "curr": {
              "min": 4526,
              "max": 22626
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "平凉",
          "name": "平凉",
          "province": "甘肃省",
          "social": {
            "prev": {
              "min": 4403,
              "max": 22014
            },
            "curr": {
              "min": 4526,
              "max": 22626
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "酒泉",
          "name": "酒泉",
          "province": "甘肃省",
          "social": {
            "prev": {
              "min": 4403,
              "max": 22014
            },
            "curr": {
              "min": 4526,
              "max": 22626
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "庆阳",
          "name": "庆阳",
          "province": "甘肃省",
          "social": {
            "prev": {
              "min": 4403,
              "max": 22014
            },
            "curr": {
              "min": 4526,
              "max": 22626
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "定西",
          "name": "定西",
          "province": "甘肃省",
          "social": {
            "prev": {
              "min": 4403,
              "max": 22014
            },
            "curr": {
              "min": 4526,
              "max": 22626
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "陇南",
          "name": "陇南",
          "province": "甘肃省",
          "social": {
            "prev": {
              "min": 4403,
              "max": 22014
            },
            "curr": {
              "min": 4526,
              "max": 22626
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "临夏",
          "name": "临夏",
          "province": "甘肃省",
          "social": {
            "prev": {
              "min": 4403,
              "max": 22014
            },
            "curr": {
              "min": 4526,
              "max": 22626
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "甘南",
          "name": "甘南",
          "province": "甘肃省",
          "social": {
            "prev": {
              "min": 4403,
              "max": 22014
            },
            "curr": {
              "min": 4526,
              "max": 22626
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        }
      ]
    },
    {
      "name": "青海省",
      "social": [
        5290,
        26448,
        5333,
        26664,
        1
      ],
      "socialMeta": {
        "status": "legacy",
        "checkedAt": null
      },
      "cities": [
        {
          "id": "西宁",
          "name": "西宁",
          "province": "青海省",
          "social": {
            "prev": {
              "min": 5290,
              "max": 26448
            },
            "curr": {
              "min": 5333,
              "max": 26664
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": 36.6171,
          "lng": 101.7782
        },
        {
          "id": "海东",
          "name": "海东",
          "province": "青海省",
          "social": {
            "prev": {
              "min": 5290,
              "max": 26448
            },
            "curr": {
              "min": 5333,
              "max": 26664
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "海北",
          "name": "海北",
          "province": "青海省",
          "social": {
            "prev": {
              "min": 5290,
              "max": 26448
            },
            "curr": {
              "min": 5333,
              "max": 26664
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "黄南",
          "name": "黄南",
          "province": "青海省",
          "social": {
            "prev": {
              "min": 5290,
              "max": 26448
            },
            "curr": {
              "min": 5333,
              "max": 26664
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "海南州",
          "name": "海南州",
          "province": "青海省",
          "social": {
            "prev": {
              "min": 5290,
              "max": 26448
            },
            "curr": {
              "min": 5333,
              "max": 26664
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "果洛",
          "name": "果洛",
          "province": "青海省",
          "social": {
            "prev": {
              "min": 5290,
              "max": 26448
            },
            "curr": {
              "min": 5333,
              "max": 26664
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "玉树",
          "name": "玉树",
          "province": "青海省",
          "social": {
            "prev": {
              "min": 5290,
              "max": 26448
            },
            "curr": {
              "min": 5333,
              "max": 26664
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "海西",
          "name": "海西",
          "province": "青海省",
          "social": {
            "prev": {
              "min": 5290,
              "max": 26448
            },
            "curr": {
              "min": 5333,
              "max": 26664
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        }
      ]
    },
    {
      "name": "宁夏回族自治区",
      "social": [
        4955,
        24774,
        5023,
        25113,
        7
      ],
      "socialMeta": {
        "status": "legacy",
        "checkedAt": null
      },
      "cities": [
        {
          "id": "银川",
          "name": "银川",
          "province": "宁夏回族自治区",
          "social": {
            "prev": {
              "min": 4955,
              "max": 24774
            },
            "curr": {
              "min": 5023,
              "max": 25113
            },
            "adjustMonth": 7,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": {
            "prev": {
              "min": 2050,
              "max": 32484
            },
            "curr": {
              "min": 2235,
              "max": 33747
            },
            "adjustMonth": 7,
            "note": "",
            "meta": {
              "status": "official",
              "checkedAt": "2026-11-23T11:41:19.378Z",
              "from": "2026-07-01",
              "to": "2027-06-30",
              "basisYear": 2025,
              "prevMissing": false,
              "doc": null,
              "source": "https://gjj.yinchuan.gov.cn/info/1025/32428.htm",
              "title": "当前位置: 首页 > 政策法规 > 正文 银川住房公积金管理中心关于2026年度住房公积金缴",
              "via": "http",
              "segments": [
                {
                  "from": "2025-07-01",
                  "to": "2026-06-30",
                  "min": 2050,
                  "max": 32484,
                  "status": "verified"
                },
                {
                  "from": "2026-07-01",
                  "to": "2027-06-30",
                  "min": 2235,
                  "max": 33747,
                  "status": "verified"
                }
              ]
            },
            "segments": [
              {
                "from": "2025-07-01",
                "to": "2026-06-30",
                "min": 2050,
                "max": 32484,
                "status": "verified"
              },
              {
                "from": "2026-07-01",
                "to": "2027-06-30",
                "min": 2235,
                "max": 33747,
                "status": "verified"
              }
            ]
          },
          "housingRates": [
            0.05,
            0.12
          ],
          "lat": 38.4872,
          "lng": 106.2309
        },
        {
          "id": "石嘴山",
          "name": "石嘴山",
          "province": "宁夏回族自治区",
          "social": {
            "prev": {
              "min": 4955,
              "max": 24774
            },
            "curr": {
              "min": 5023,
              "max": 25113
            },
            "adjustMonth": 7,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "吴忠",
          "name": "吴忠",
          "province": "宁夏回族自治区",
          "social": {
            "prev": {
              "min": 4955,
              "max": 24774
            },
            "curr": {
              "min": 5023,
              "max": 25113
            },
            "adjustMonth": 7,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "固原",
          "name": "固原",
          "province": "宁夏回族自治区",
          "social": {
            "prev": {
              "min": 4955,
              "max": 24774
            },
            "curr": {
              "min": 5023,
              "max": 25113
            },
            "adjustMonth": 7,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "中卫",
          "name": "中卫",
          "province": "宁夏回族自治区",
          "social": {
            "prev": {
              "min": 4955,
              "max": 24774
            },
            "curr": {
              "min": 5023,
              "max": 25113
            },
            "adjustMonth": 7,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        }
      ]
    },
    {
      "name": "新疆维吾尔自治区",
      "social": [
        5069,
        25344,
        5246,
        26231,
        1
      ],
      "socialMeta": {
        "status": "legacy",
        "checkedAt": null
      },
      "cities": [
        {
          "id": "乌鲁木齐",
          "name": "乌鲁木齐",
          "province": "新疆维吾尔自治区",
          "social": {
            "prev": {
              "min": 5069,
              "max": 25344
            },
            "curr": {
              "min": 5246,
              "max": 26231
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": 43.8256,
          "lng": 87.6168
        },
        {
          "id": "克拉玛依",
          "name": "克拉玛依",
          "province": "新疆维吾尔自治区",
          "social": {
            "prev": {
              "min": 5069,
              "max": 25344
            },
            "curr": {
              "min": 5246,
              "max": 26231
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "吐鲁番",
          "name": "吐鲁番",
          "province": "新疆维吾尔自治区",
          "social": {
            "prev": {
              "min": 5069,
              "max": 25344
            },
            "curr": {
              "min": 5246,
              "max": 26231
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "哈密",
          "name": "哈密",
          "province": "新疆维吾尔自治区",
          "social": {
            "prev": {
              "min": 5069,
              "max": 25344
            },
            "curr": {
              "min": 5246,
              "max": 26231
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "昌吉",
          "name": "昌吉",
          "province": "新疆维吾尔自治区",
          "social": {
            "prev": {
              "min": 5069,
              "max": 25344
            },
            "curr": {
              "min": 5246,
              "max": 26231
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "博尔塔拉",
          "name": "博尔塔拉",
          "province": "新疆维吾尔自治区",
          "social": {
            "prev": {
              "min": 5069,
              "max": 25344
            },
            "curr": {
              "min": 5246,
              "max": 26231
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "巴音郭楞",
          "name": "巴音郭楞",
          "province": "新疆维吾尔自治区",
          "social": {
            "prev": {
              "min": 5069,
              "max": 25344
            },
            "curr": {
              "min": 5246,
              "max": 26231
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "阿克苏",
          "name": "阿克苏",
          "province": "新疆维吾尔自治区",
          "social": {
            "prev": {
              "min": 5069,
              "max": 25344
            },
            "curr": {
              "min": 5246,
              "max": 26231
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "克孜勒苏",
          "name": "克孜勒苏",
          "province": "新疆维吾尔自治区",
          "social": {
            "prev": {
              "min": 5069,
              "max": 25344
            },
            "curr": {
              "min": 5246,
              "max": 26231
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "喀什",
          "name": "喀什",
          "province": "新疆维吾尔自治区",
          "social": {
            "prev": {
              "min": 5069,
              "max": 25344
            },
            "curr": {
              "min": 5246,
              "max": 26231
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "和田",
          "name": "和田",
          "province": "新疆维吾尔自治区",
          "social": {
            "prev": {
              "min": 5069,
              "max": 25344
            },
            "curr": {
              "min": 5246,
              "max": 26231
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "伊犁",
          "name": "伊犁",
          "province": "新疆维吾尔自治区",
          "social": {
            "prev": {
              "min": 5069,
              "max": 25344
            },
            "curr": {
              "min": 5246,
              "max": 26231
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "塔城",
          "name": "塔城",
          "province": "新疆维吾尔自治区",
          "social": {
            "prev": {
              "min": 5069,
              "max": 25344
            },
            "curr": {
              "min": 5246,
              "max": 26231
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        },
        {
          "id": "阿勒泰",
          "name": "阿勒泰",
          "province": "新疆维吾尔自治区",
          "social": {
            "prev": {
              "min": 5069,
              "max": 25344
            },
            "curr": {
              "min": 5246,
              "max": 26231
            },
            "adjustMonth": 1,
            "meta": {
              "status": "legacy",
              "checkedAt": null
            },
            "segments": []
          },
          "housing": null,
          "housingRates": null,
          "lat": null,
          "lng": null
        }
      ]
    }
  ]
};

  const INDEX = {};

  DATA.provinces.forEach((prov) => {
    prov.cities.forEach((city) => { INDEX[city.id] = city; });
  });

  const TOTAL_CITIES = Object.keys(INDEX).length;
  const HOUSING_CITIES = Object.keys(INDEX).filter((id) => INDEX[id].housing).length;

  function getCity(id) { return INDEX[id] || null; }

  function defaultHousingRate(city) {
    if (!city || !city.housingRates) return 0.12;
    return Math.min(Math.max(0.12, city.housingRates[0]), city.housingRates[1]);
  }

  function provinceOf(cityId) {
    const c = getCity(cityId);
    return c ? c.province : '';
  }

  function haversine(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const toRad = (d) => (d * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a = Math.sin(dLat / 2) ** 2
      + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(a));
  }

  function nearestCity(lat, lng) {
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    let best = null;
    let bestKm = Infinity;
    Object.keys(INDEX).forEach((id) => {
      const c = INDEX[id];
      if (!Number.isFinite(c.lat) || !Number.isFinite(c.lng)) return;
      const km = haversine(lat, lng, c.lat, c.lng);
      if (km < bestKm) { bestKm = km; best = c; }
    });
    return best ? { city: best, km: bestKm } : null;
  }

  const API = {
    DATA, INDEX, TOTAL_CITIES, HOUSING_CITIES,
    getCity, defaultHousingRate, provinceOf, nearestCity, haversine,
    metaOf: (id) => {
      const c = getCity(id);
      return c ? { social: c.social.meta, housing: c.housing ? c.housing.meta : null } : null;
    },
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else root.CityData = API;
})(typeof globalThis !== 'undefined' ? globalThis : this);
