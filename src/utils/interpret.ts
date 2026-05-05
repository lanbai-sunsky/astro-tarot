import type { DrawnCard } from '@/stores/tarot'

export function interpretTarot(cards: DrawnCard[]): string {
  if (cards.length === 1) {
    const c = cards[0]
    const dir = c.reversed ? '逆位' : '正位'
    const m = c.reversed ? c.card.meanings.general.reversed : c.card.meanings.general.upright
    return `【${c.card.name} · ${dir}】\n\n${m}`
  }

  if (cards.length === 3) {
    const positions = ['过去', '现在', '未来']
    let result = ''
    for (let i = 0; i < cards.length; i++) {
      const c = cards[i]
      const dir = c.reversed ? '逆位' : '正位'
      const m = c.reversed ? c.card.meanings.general.reversed : c.card.meanings.general.upright
      result += `【${positions[i]}：${c.card.name} · ${dir}】\n${m}\n\n`
    }
    result += `\n💡 综合解读：${cards[1].card.name}作为当前的核心能量，结合${cards[0].card.name}所代表的过去影响，指向${cards[2].card.name}所预示的未来方向。请结合三张牌的指引，洞察你当下的处境。`
    return result
  }

  return ''
}

export function buildAiPrompt(cards: DrawnCard[], question: string): string {
  const cardList = cards.map((c, i) => {
    const pos = cards.length === 3 ? ['过去', '现在', '未来'][i] : `牌${i + 1}`
    const dir = c.reversed ? '逆位' : '正位'
    return `${pos}：${c.card.name}（${dir}）`
  }).join('\n')

  return `你是一位资深的塔罗牌解读师。请根据以下牌阵进行占卜解读：

${cardList}

${question ? `询问者的问题是：${question}` : '询问者没有提具体问题，请给出总体指引。'}

请结合每张牌的正逆位含义，给出温暖、有洞察力且实用的解读。格式：
1. 整体概述（2-3句）
2. 每张牌的详细指引
3. 总结建议（2-3句）`
}
