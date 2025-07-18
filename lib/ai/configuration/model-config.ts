// // temperature 控制“跳跃性”；top_k 控制可选词汇池的宽度
// export const samplingConfigs = [
//     {
//         name: "lowT_lowK",          // 双低：输出最稳健、重复度高
//         temperature: 0.2,           // 0 ~ 0.3 通常被视为“低”
//         top_k: 20                   // 10 ~ 30 属于“低”
//     },
//     {
//         name: "highT_highK",        // 双高：输出最具创造性、离散度最大
//         temperature: 0.9,           // 0.8 ~ 1.0 视为“高”
//         top_k: 100                  // 80 ~ 120 属于“高”
//     },
//     {
//         name: "highT_lowK",         // 高温+窄池：句式跳跃但主题集中
//         temperature: 0.9,
//         top_k: 20
//     },
//     {
//         name: "lowT_highK",         // 低温+宽池：语义连贯但细节多样
//         temperature: 0.2,
//         top_k: 100
//     }
// ] as const;
