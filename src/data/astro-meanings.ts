// 占星解读中文模板 — 约 80+ 条核心模板 + 通用兜底逻辑

export const signNames: Record<string, string> = {
  Aries: '白羊座', Taurus: '金牛座', Gemini: '双子座', Cancer: '巨蟹座',
  Leo: '狮子座', Virgo: '处女座', Libra: '天秤座', Scorpio: '天蝎座',
  Sagittarius: '射手座', Capricorn: '摩羯座', Aquarius: '水瓶座', Pisces: '双鱼座',
}

// celestine formatted strings use 3-letter abbreviations
const signAbbr: Record<string, string> = {
  Ari: '白羊座', Tau: '金牛座', Gem: '双子座', Can: '巨蟹座',
  Leo: '狮子座', Vir: '处女座', Lib: '天秤座', Sco: '天蝎座',
  Sag: '射手座', Cap: '摩羯座', Aqu: '水瓶座', Pis: '双鱼座',
}

export function toChineseFormatted(en: string): string {
  let result = en
  for (const [abbr, cn] of Object.entries(signAbbr)) {
    result = result.replace(abbr, cn)
  }
  // Also try full English names as fallback
  for (const [enName, cnName] of Object.entries(signNames)) {
    result = result.replace(enName, cnName)
  }
  return result
}

export const planetNames: Record<string, string> = {
  Sun: '太阳', Moon: '月亮', Mercury: '水星', Venus: '金星', Mars: '火星',
  Jupiter: '木星', Saturn: '土星', Uranus: '天王星', Neptune: '海王星', Pluto: '冥王星',
  Chiron: '凯龙星', Ceres: '谷神星', Pallas: '智神星', Juno: '婚神星', Vesta: '灶神星',
  Ascendant: '上升点', Midheaven: '中天',
  'North Node': '北交点', 'South Node': '南交点', 'True Node': '北交点',
  Lilith: '莉莉丝', 'Black Moon Lilith': '暗月莉莉丝',
  Vertex: '宿命点', 'Part of Fortune': '福点',
}

export const aspectMeanings: Record<string, string> = {
  conjunction: '合相（0°）—— 两颗行星的能量融合，相互增强。这是最强大的相位，两个领域的议题紧密交织。',
  opposition: '对冲（180°）—— 两颗行星相互拉扯，需要在两个极端之间找到平衡。这种张力往往驱动成长。',
  trine: '三分相（120°）—— 和谐流畅的能量流动。天赋所在，事情自然顺利，但需警惕过于安逸。',
  square: '四分相（90°）—— 内在的冲突和挑战。看似障碍，实为成长的催化剂，推动你突破舒适区。',
  sextile: '六分相（60°）—— 潜在的机遇和才能。需要主动把握才能发挥其积极的能量。',
}

export const signInterpretations: Record<string, string> = {
  Aries: '白羊座是火象基本星座，象征开创、勇气和直接行动。你具有与生俱来的领导力和无畏精神，喜欢挑战，敢于做第一个吃螃蟹的人。需要注意避免冲动和缺乏耐心。',
  Taurus: '金牛座是土象固定星座，象征稳定、感官享受和持久力。你重视安全感和物质基础，拥有非凡的耐心和审美力。需要注意避免固执和过度物质主义。',
  Gemini: '双子座是风象变动星座，象征沟通、好奇心和多面性。你思维敏捷，善于学习和表达，适应能力强。需要注意避免浅尝辄止和注意力分散。',
  Cancer: '巨蟹座是水象基本星座，象征家庭、情感和滋养。你情感丰富且直觉敏锐，天生懂得照顾他人。需要注意避免情绪化和过度依赖。',
  Leo: '狮子座是火象固定星座，象征创造力、自信和热情。你天生具有舞台魅力，喜欢被欣赏和认可。需要注意避免自负和过度需要关注。',
  Virgo: '处女座是土象变动星座，象征分析、服务和完美主义。你细致入微，追求卓越，富有实际能力。需要注意避免过度挑剔和焦虑。',
  Libra: '天秤座是风象基本星座，象征和谐、美感和公平。你追求平衡和优雅，善于人际交往和合作。需要注意避免犹豫不决和过度妥协。',
  Scorpio: '天蝎座是水象固定星座，象征深度、转化和力量。你拥有极强的洞察力和意志力，善于在危机中发现真相。需要注意避免控制欲和记仇。',
  Sagittarius: '射手座是火象变动星座，象征探索、自由和智慧。你乐观开朗，热爱冒险和哲学思考，追求更广阔的人生视野。需要注意避免不负责任和说教。',
  Capricorn: '摩羯座是土象基本星座，象征成就、纪律和野心。你坚韧不拔、脚踏实地，有极强的责任感和组织能力。需要注意避免过于严肃和工作狂。',
  Aquarius: '水瓶座是风象固定星座，象征创新、独立和人道主义。你思想前卫，特立独行，关心社会和人类的进步。需要注意避免疏离和过度理性。',
  Pisces: '双鱼座是水象变动星座，象征灵性、同情心和想象力。你极具直觉力和艺术天赋，富有牺牲精神。需要注意避免逃避现实和界限不清。',
}

export const planetInSign: Record<string, Record<string, string>> = {
  Sun: {
    Aries: '你拥有开拓者的勇气和领导力，人生的核心主题是勇敢做自己、主动开创。',
    Taurus: '你的核心能量是稳定和坚持，通过建立持久的价值和感官的享受来表达自我。',
    Gemini: '你以智慧和沟通来表达自我，人生的主题是不断学习、连接和分享信息。',
    Cancer: '你的本质是敏感而滋养的，通过情感连接和照顾他人来找到自我价值。',
    Leo: '你的核心是创造和发光。人生主题是通过自我表达和热情感染他人来绽放光芒。',
    Virgo: '你以精准和服务来表达自我，人生的主题是通过不断完善和实际帮助来实现价值。',
    Libra: '你的核心是和谐与美。通过建立关系、追求公平和创造美好的事物来表达自我。',
    Scorpio: '你的本质是深刻和强大的。人生主题是通过深度转化和探索生命真相来获得力量。',
    Sagittarius: '你以探索和自由来表达自我。人生主题是不断拓展视野、追寻智慧和意义。',
    Capricorn: '你的核心是成就和责任。通过建立事业、承担责任和攀登高峰来实现人生价值。',
    Aquarius: '你以创新和独立来表达自我。人生主题是打破常规、追求理想和推动社会进步。',
    Pisces: '你的本质是灵性和慈悲。通过艺术、灵修或服务他人来找到人生的更深意义。',
  },
  Moon: {
    Aries: '情绪来得快去得也快。你需要在独立和挑战中找到情感的安全感。',
    Taurus: '情感需要稳定和物质的保障。被温柔对待和感官享受能让你感到安心。',
    Gemini: '情感需要通过交流和多元化的体验来获得满足。好奇心是你的情绪出口。',
    Cancer: '月亮回归自己的星座——你情感极其丰富敏锐，家庭和归属感是情绪的根基。',
    Leo: '情感需要被欣赏和认可。在创造和被关注中你感到情感上的满足。',
    Virgo: '情感以务实的方式处理。通过照顾细节和帮助他人来获得情绪上的平衡。',
    Libra: '情感需要在和谐的关系中找到平静。陪伴和美好事物是你情绪的港湾。',
    Scorpio: '情感深沉且强烈。你需要深度的情感连接和绝对的信任才能感到安全。',
    Sagittarius: '情感需要自由和冒险。探索未知和追求理想能让你保持情绪的积极。',
    Capricorn: '情感表达较为克制。通过成就和责任来建立情感的安全基础。',
    Aquarius: '情感需要理智和独立的空间。在朋友和更大的理想中找到情感的归属。',
    Pisces: '情感极为细腻和敏感。艺术、灵性或服务他人是你情绪的避风港。',
  },
  Mercury: {
    Aries: '思维快速直接，说话不绕弯子。决策果断，富有创意的想法。',
    Taurus: '思维稳健务实，学习需要时间消化。一旦学会就不容易忘记。',
    Gemini: '思维极其敏捷灵活，天生的沟通者。对各类知识都充满好奇心。',
    Cancer: '思维受情感和记忆影响深远。善于用故事和情感打动人。',
    Leo: '思维充满创意和戏剧性。善于用富有感染力的方式表达观点。',
    Virgo: '思维精准细致，善于分析和归纳。学习能力强，追求逻辑的完美。',
    Libra: '思维追求平衡和公正。善于从多个角度看问题，是天生的外交家。',
    Scorpio: '思维深入透彻，善于发现真相和秘密。不满足于表面的答案。',
    Sagittarius: '思维开阔宏观，善于看到大局。对哲学和抽象概念有浓厚兴趣。',
    Capricorn: '思维严谨务实，注重结构和效率。说话简洁有力，切中要害。',
    Aquarius: '思维创新超前，善于跳出框架思考。常有与众不同的洞见。',
    Pisces: '思维方式直觉化而富有想象力。适合用艺术和隐喻来表达思想。',
  },
  Venus: {
    Aries: '爱情中主动热烈，喜欢追求的过程。对喜欢的人会直接表达。',
    Taurus: '爱情中对感官和稳定极为看重。喜欢通过礼物和身体接触表达爱意。',
    Gemini: '爱情中需要智力的碰撞和多样的体验。有趣的对话是最好的前戏。',
    Cancer: '爱情中极为细腻和念旧。需要安全感和情感的深度连接。',
    Leo: '爱情中大方热情，喜欢浪漫和仪式感。会用心让伴侣感受到特别。',
    Virgo: '爱情中以实际的行动来表达。默默做事比甜言蜜语更有意义。',
    Libra: '爱情追求优雅和和谐。天生浪漫，最懂得如何维系平等美好的关系。',
    Scorpio: '爱情中投入全部的热情和忠诚。渴望灵魂层面的深度结合。',
    Sagittarius: '爱情中需要自由和冒险。喜欢和伴侣一起探索世界和思想。',
    Capricorn: '爱情中认真负责。对长期承诺非常看重，以行动兑现爱的诺言。',
    Aquarius: '爱情中需要友谊和智力的共鸣。不喜欢传统的浪漫套路。',
    Pisces: '爱情中浪漫且无条件。愿意为爱牺牲，追求灵魂伴侣的完美融合。',
  },
  Mars: {
    Aries: '行动力爆表，竞争意识强。喜欢直接快速的行动方式，是天生的先锋。',
    Taurus: '行动缓慢但极其坚定。一旦开始就不会轻易放弃，耐力惊人。',
    Gemini: '行动方式灵活多变，善于多线程处理。用智力和语言来竞争。',
    Cancer: '行动受情绪驱动。为保护所爱的人事物而战时最为强大。',
    Leo: '行动充满戏剧性和自信。喜欢以引人注目的方式做事和竞争。',
    Virgo: '行动精准高效。做事细致周到，善于策略性思考和完美执行。',
    Libra: '行动追求优雅和公正。不喜欢正面冲突，善于通过协商和合作取胜。',
    Scorpio: '行动力极为专注和强大。不鸣则已一鸣惊人，善于在暗中布局。',
    Sagittarius: '行动充满热情和冒险精神。喜欢大踏步前进，有时缺乏细节考量。',
    Capricorn: '行动有计划有步骤。善于长期布局，每一步都考虑周全。',
    Aquarius: '行动方式与众不同。喜欢以创新的方式做事，不受常规约束。',
    Pisces: '行动受直觉和灵感引导。柔软但极富创造力，以柔克刚。',
  },
}

export function getPlanetInSignText(planet: string, sign: string): string {
  return planetInSign[planet]?.[sign] ?? `${planetNames[planet] || planet}落在${signNames[sign] || sign}，赋予你独特的表达方式和能量。`
}

export function getSignText(sign: string): string {
  return signInterpretations[sign] ?? `${signNames[sign] || sign}的特质在你的星盘中占有重要位置。`
}
