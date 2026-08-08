---
title: "人工智能理论知识点"
description: "整理人工智能课程理论知识点，覆盖知识表示与推理、搜索、机器学习、强化学习与智能体等核心内容。"
publishedAt: 2026-08-08
tags: ["学习笔记", "人工智能"]
---
# 人工智能绪论

1.人工智能主要学派：

符号主义：逻辑推理为核心

连接主义：数据驱动下机器学习为核心

行为主义：以控制论为核心

2.主要内容

逻辑与推理 搜索求解 机器学习 强化学习 Agent 智能体

## 知识表示与推理

1.知识表示：数据、知识、信息、知识表示的定义

2.命题逻辑：略

3.谓词逻辑：略

4.逻辑推理

a.演绎推理：一般到个别

b.归纳推理：个别到一般

c.溯因推理

d.自然演绎推理：从一组已知为真的事实出发，运用经典逻辑的推理规则

e.归结演绎推理：

证明𝑃→𝑄等价于证明语句𝑭=(𝑃_1∧𝑃_2∧…∧𝑃_𝑛)∧¬𝑄为假，转换为证明子句集𝑆={𝑃_1,𝑃_2,…,𝑃_𝑛,¬𝑄}是不可满足的

<img src="../../blog-assets/2026-08-08-artificial-intelligence-theory-notes/image-001.png" alt="image 001" />

归结式：A B进行归结后的子句C，A B称为C的亲本子句。归结式是这两个子句集的逻辑推论

5. 命题逻辑的归结推理

步骤

(1)把前提F转为子句集𝑆_0

(2)命题𝑃的否定式¬𝑃也转化成子句集表示，并将其加到𝑆_0中

(3)反复应用归结推理规则，直到出现空子句

6.谓词逻辑的归结推理

步骤类似，不同之处：谓词公式化为子句集较复杂，归结时需要合一

合一：寻找项之间合适的变量置换使表达式一致。

合一项/置换：𝜎={𝑥_1/t_1,𝑥_2/t_2,…,𝑥_𝑛/t_𝑛}

最一般合一项：最小简洁的合一项

求最一般合一项的算法：

<img src="../../blog-assets/2026-08-08-artificial-intelligence-theory-notes/image-002.png" alt="image 002" />

谓词公式化为子句集:

(1)消去蕴含和等价

(2)将否定符号移动到谓词前

(3)变量改名

(4)消去存在量词eg

<img src="../../blog-assets/2026-08-08-artificial-intelligence-theory-notes/image-003.png" alt="image 003" />

(5) 化为前束型

(6) 把母式化成合取范式

(7) 略去全称量词

(8) 把母式用子句集表示

可判定问题/ 不可判定问题

7.用归结原理解决问题

<img src="../../blog-assets/2026-08-08-artificial-intelligence-theory-notes/image-004.png" alt="image 004" />

## 搜索技术I

一、搜索的定义

1.

状态空间(state space)：表示需要进行搜索的空间。状态空间是对问题的形式化

动作(action)：表示从一个状态到另一个状态。动作是对真实的动作的形式化

初始状态(initial state)：当前状态的表示

目标(goal)：需要达到的目标状态的表示

启发式方法(heuristics)：用于指导搜索的前进方向

解(solution): 是由“动作”构成的序列

2.搜索算法

状态：可以是物理状态，也可能是智能体的认知状态（物理状态的集合）

后继函数：S(x) = {x状态经过一个动作之后可以到达的状态的集合}

目标测试：一个作用于状态上，当该状态满足目标条件时返回真的函数

前进成本：C(x,a,y) = 从x状态通过动作a到达y状态所需要的成本 (x状态无法到达y状态时，∀_𝑎C(x,a,y) = )

边界 (Open 表) 还没有被探索，但准备下一步探索的状态的集合

3.搜索算法的重要特征

完备性：能不能在有解时找到解

最优性：能否找到最小的解

时间复杂度：最多探索多少节点

空间复杂度：最多存储多少个节点

二、盲目搜索

总体特征：
都采用固定的规则来选择下一需要被扩展的状态，不会随着要搜索解决的问题的变化而变化

1.宽度优先

对边界上的元素进行排序，总是选择第一个元素

2.深度优先

边界上总是扩展最深的那个节点

3.一致代价

边界按按路径的成本升序排列，总是扩展成本最低的那条路径

4.深度受限

预先限制了搜索的深度 L

5.迭代加深搜索

一开始设置深度限制为L = 0，我们迭代地增加深度限制，对于每个深度限制都进行深度受限搜索

6.双向搜索

同时进行从初始状态向前的搜索和从目标节点向后搜索，在两个搜索在中间相遇时停止搜索

<img src="../../blog-assets/2026-08-08-artificial-intelligence-theory-notes/image-005.png" alt="image 005" />

7.路径检测

单独检测每条路径是否出现重复节点，用于确保状态（节点） c 与它所在路径上的祖先节点都不相等

8.环检测

记录下在之前的搜索过程中扩展过的所有节点，当扩展节点 nk 获得子节点c时，确保节点c不等于之前任何扩展过的节点

（对于一致代价搜索，环检测可以保留一致代价搜索的最优性）

三、启发式搜索

构造启发式函数h(n)：估算节点n（状态）到目标节点（状态）的成本、

（目标状态h(n)=0）

评价函数f(n)：f(n)越小越好

G(n):起始节点到当前节点的代价（当前最小代价）

1.贪心最好优先搜索

f(n)=h(n)

2.一致代价搜索

F(n)=g(n)

3.A搜索

F(n)=g(n)+h(n)

4.h(n)的条件

A.可采纳性（这一点就保证了最优性，只要不环检测）满足了可采纳性，该算法就是A*算法

要满足所有节点𝒏，满足𝒉(𝒏) ≤ 𝒉^∗ (𝒏)，h（n）才可采纳

| – g(n)是从 | S 走到 | n 的所有方式中，代价最小的路径，记为g*(n) |
| --- | --- | --- |
| – h(n)是从 | n 走到 | E 的所有方式中，代价最小的路径，记为h*(n) |

B.一致性（单调性）（）有单调性一般就有最优性

ℎ(𝑛1) ≤ 𝑐(𝑛1 → 𝑛2) + ℎ(𝑛2)

只要启发式函数具备单调性，就能在进行环检测之后仍然保持最优性

5.单调性相关结论

a.一条路径的f应当非递减

b.后拓展的节点f值更大

c.遍历到n节点时，所有f值小于f（n）的节点都被遍历了

d.A*算法第一次到某个节点，则已经找到了到该节点的最小成本路径

6.构建启发式函数

若两个启发式函数都是可采纳的，且有h1(n)<h2(n),则称h2(n)支配了h1(n)（h2(n)包含更多的信息）

<img src="../../blog-assets/2026-08-08-artificial-intelligence-theory-notes/image-006.png" alt="image 006" />

## 搜索技术II

一、背景

1.博弈的主要特点

<img src="../../blog-assets/2026-08-08-artificial-intelligence-theory-notes/image-007.png" alt="image 007" />

2.博弈的特征

两个玩家

离散的：游戏的状态和策略可被映射为离散的

有限的：游戏的状态和行动是有限的

确定性：没有不确定因素

完美信息：任何层面的状态是可以观察的

零和博弈：一方赢了，对方输掉相同的数量

3.有多步的博弈称为 扩展形式的博弈

4.两玩家零和博弈的定义

玩家A(max)B(Min)

状态集合S（游戏状态的有限集合）

初始状态I属于S

终止位置T属于S（终止状态）

后继函数（输入：一个状态，输出：通过动作可以到达的状态）

效益/收益U/V:T->R（将终止状态映射到实数的函数）

5.两玩家零和博弈介绍

两玩家交替行动（A开始）到某个状态t结束

游戏状态：状态-玩家对

效益函数和终止状态（即U(t)）代替原来的目标状态

零和：玩家A或Max获得了𝑈(𝑡)的收益，玩家B或Min获得了−𝑈(𝑡)的收益

二、MiniMax算法

构建完整的博弈树：每个叶子节点（终止状态）都标记了对应的效益值

反向传播效益值

缺点：太大

三、Alpha-beta剪枝

每次更改数值要看父节点是否嫌弃，嫌弃则剪枝

α取遍历重最大 β取遍历中最小 实时更新

α剪枝-对max节点-α值变得 ≥ β停止

β剪枝-对min节点-α值变得 ≥ β

真实游戏中根本无法扩展到叶子节点，因此需要启发式地计算非叶子节点的效用值，这样的启发式方法被称为评价函数

四、蒙特卡洛树搜索

## 搜索技术III

一、爬山法搜索

一直向值增加的方向持续移动，直到到达“峰顶”（局部最优）。

如果不能上山，允许侧向移动。

二、模拟退火算法（在爬山法的基础上一定程度接收劣解，能够走出极值区）

<img src="../../blog-assets/2026-08-08-artificial-intelligence-theory-notes/image-008.png" alt="image 008" />

三个函数：

1.状态产生函数（选择领域的状态）

2.状态接收函数：常用图中给出了

3.温度更新函数：常见做法（设置终止温度、外循环次数）

两个终止准则：

1.内循环（什么时候同温度下，达到稳定）

2.外循环（什么时候到底最低温度）

PS：初温越大解的质量越好，但计算时间变长

三、遗传算法

<img src="../../blog-assets/2026-08-08-artificial-intelligence-theory-notes/image-009.png" alt="image 009" />

编码：1.位串编码 2. 实数编码

初始种群的产生：1.随机产生一定规模的种群 2.设定一个预先规模，产生更大的种群，选取最好的不断迭代 3.

适应度函数：两种办法把目标函数转换为适应度函数

<img src="../../blog-assets/2026-08-08-artificial-intelligence-theory-notes/image-010.png" alt="image 010" />

<img src="../../blog-assets/2026-08-08-artificial-intelligence-theory-notes/image-011.png" alt="image 011" />

选择（以进行交叉）：

1.轮盘赌选择：

每个个体的选择概率=每个个体适应度/总适应度

按各个体选择概率制作轮盘，生成随机数，落在哪个区域就选择谁

2.锦标赛选择：
随机选若干个，选其中最好，如此循环，直到满选

3.最佳个体保存：

把最好的个体直接保存到下代，不进行交叉

交叉：

1.单点交叉：随机选一个点的前/后进行交叉产生后代

2.两点交叉：设置两个交叉点，两个交叉点之间的段互换

变异：

1.位点变异：随机选任意数量任意位置点，进行变异

2.逆转变异：随机选两个逆转点，逆转点之间进行逆转变异

3.插入变异：

4.互换变异：

5.移动变异：

## 不确定性知识表示与推理

一、背景知识

1.不确定性的来源

信息不完整

随机性

模糊性

在不确定性环境下进行理性决策，通常意味着最大化期望效用

二、理论基础

A的条件下，BC条件独立：

Pr(B|A ∩ C) = Pr(B|A)；

Pr(B ∩ C|A) = Pr(B|A) · Pr(C|A)

链式法则：
P(A1A2…An) =P(A1| A2…An) * P(A2| A3 …An)* … * P(An-1| An) * P(An)

三、朴素贝叶斯

<img src="../../blog-assets/2026-08-08-artificial-intelligence-theory-notes/image-012.png" alt="image 012" />

<img src="../../blog-assets/2026-08-08-artificial-intelligence-theory-notes/image-013.png" alt="image 013" />

四、贝叶斯网络

贝叶斯网络组成：有向无环图+条件概率表

<img src="../../blog-assets/2026-08-08-artificial-intelligence-theory-notes/image-014.png" alt="image 014" />

所有变量联合概率等于每个变量的条件概率

构建贝叶斯网络步骤：

1.对联合概率运用链式法则

2.对每个变量考虑其条件集合中的变量是否独立，独立则从条件集合删除

3.构建有向无环图，变量的父节点为其条件集合的节点

五、D-分离

若Z阻塞了节点X和节点Y之间的每一条路径，则称给定Z时，X和Y 是D-分离，即给定Z时，X和Y条件独立。

机器学习（）

一、机器学习原理

1.机器学习=找一个函数

<img src="../../blog-assets/2026-08-08-artificial-intelligence-theory-notes/image-015.png" alt="image 015" />

2.机器学习三大任务

回归：函数输出是数值

分类：函数输出是类别

生成：函数输出是某种数据

3.机器学习三大步骤

设定范围：确定候选函数的集合（模型Model）

设定标准：确定评价函数好坏的标准（损失Loss）

达成目标：找到最好的函数->最优化（optimization）

二、机器学习范式

监督学习：训练数据(Data)+全部标签(Label)

无监督学习：训练数据（无需标签）

半监督学习：训练数据+部分标签

强化学习：智能体在环境中采取行动时的状态(State) 和 奖励(Reward)

1.监督学习（训练数据x，y）

回归：y是数值，学习函数f（x），x可以多维

分类：y是类型，学习函数f（x），x可以多维

2.半监督学习（训练数据x，y，但只有部分的x有y）

学习函数f（x），只有部分的x有标注y（标签）

3.无监督学习（训练数据只有x）

输出x背后的隐藏结构特征（如聚类）

4.强化学习

给定：一系列带有(延迟)奖励 (reward) 的 状态 (state) 和 动作 (action)

输出：一个策略 (policy)

策略：状态→动作的映射，代表给定状态下应该完成的动作

无监督（聚类clustering）算法

1.聚类：寻找一组对象，使得同一组内的对象彼此相关，而与不同组内的对象不相关

2.聚类类型：

A.分割式聚类：将数据对象划分为不重叠的子集（簇），每个对象属于一个子集

B.阶层式聚类：一组嵌套簇，组织为层次树结构

3.簇（cluster）的类型：

<img src="../../blog-assets/2026-08-08-artificial-intelligence-theory-notes/image-016.png" alt="image 016" />

一、K-means算法

1.选初始k个质点

循环2.3：

2.计算每个点到质点的距离，离哪个质点近，就属于哪个簇

3.每个簇的点计算平均值，得出新的质点

4.收敛算法结束

要考虑的问题：

1.K值的选择：

定义一评价指标SSE

（每个簇中所有点到质点的距离平方和）

<img src="../../blog-assets/2026-08-08-artificial-intelligence-theory-notes/image-017.png" alt="image 017" />

随着K的增大，SSE必然减小，曲线类似于手臂曲线，取肘关节即为最佳K值

2.初始质心的选择

采用Bisecting(二分) K-means：初始时将整个数据集视为单个簇，逐步选择现有簇进行二分（每次用K-means划分为两个子簇），直到达到预设的簇数（k）

3.处理空簇
将对SSE贡献最大的点加入空簇

局限性：

大小、密度、非球形 效果不好
克服办法：尽量选更大的K（分更多的簇）

K-means++（解决初始质心选择问题）

<img src="../../blog-assets/2026-08-08-artificial-intelligence-theory-notes/image-018.png" alt="image 018" />

K-means可伸缩

二、DBSCAN算法（density-basesd）

概念：

Eps：领域半径

Density密度：Eps内的点的个数

Core核心点：Eps内有一定数量（MinPts）的点

Border边界点：Eps内没有点的数量没有达到MinPts，但在Core点的领域内

Noise噪点：Eps内没有点的数量没有达到MinPts，，也不再Core点的领域内

算法流程：

1.标记所有点的类型（核心、边界、噪声）

2.核心点和其领域上的边界点构成一个簇

要考虑的问题：

1.确定EPS和MinPts

三、簇的评估

外部指标：外部指标用于比较聚类结果与外部提供的真实标签，衡量两者的一致性

内部指标：内部指标不依赖外部标签，仅使用数据本身来评估聚类质量，关注簇的紧密度（cohesion）和分离度（separation）

相关指标

1.SSE
2.凝聚度

3.分离度

## 人工神经网络

1.人工神经元模型MP

<img src="../../blog-assets/2026-08-08-artificial-intelligence-theory-notes/image-019.jpg" alt="image 019" />

<img src="../../blog-assets/2026-08-08-artificial-intelligence-theory-notes/image-020.png" alt="image 020" />

G又称为激活函数

MP缺陷：参数是设定的，无法学习

2.感知机（单层神经网络）（perception）

<img src="../../blog-assets/2026-08-08-artificial-intelligence-theory-notes/image-021.png" alt="image 021" />

两层神经元节点。使用sgn函数作为激活函数g

输入层神经元：只传输数据，不做计算

输出层神经元：对前面一层的输出进行计算

<img src="../../blog-assets/2026-08-08-artificial-intelligence-theory-notes/image-022.png" alt="image 022" />

参数是训练出来的，训练法则：

<img src="../../blog-assets/2026-08-08-artificial-intelligence-theory-notes/image-023.png" alt="image 023" />

感知机缺陷：只能处理线性可分的数据集a（异或数据不是）

3.多层感知机（MLP）（多层神经网络）

<img src="../../blog-assets/2026-08-08-artificial-intelligence-theory-notes/image-024.png" alt="image 024" />

<img src="../../blog-assets/2026-08-08-artificial-intelligence-theory-notes/image-025.png" alt="image 025" />

<img src="../../blog-assets/2026-08-08-artificial-intelligence-theory-notes/image-026.png" alt="image 026" />

MLP通常使用sigmoid作为激活函数

<img src="../../blog-assets/2026-08-08-artificial-intelligence-theory-notes/image-027.png" alt="image 027" />

本质：通过矩阵参数W和激活函数g来拟合数据和目标之间的关系

原理：隐藏层的激活函数g使得原始数据x由线性不可分变为了线性可分

如何训练：向前传播（计算当前参数下的误差）+向后传播（根据当前的误差调整参数）

向前传播：由输入数据计算的到输出结果，再计算误差，

<img src="../../blog-assets/2026-08-08-artificial-intelligence-theory-notes/image-028.png" alt="image 028" />

向后传播：误差函数L(W)从后向前对每个w依次求梯度（偏导数），然后调整参数w使得梯度下降

## 决策树

每个节点：某种属性的测试

每个节点的分支：该属性的某种取值

学习过程：建立决策树

预测过程：在已建立的决策树由顶自下

<img src="../../blog-assets/2026-08-08-artificial-intelligence-theory-notes/image-029.png" alt="image 029" />

决策树算法的核心：即基于什么指标去选择属性建树

1.CLS算法（基础算法）

测试属性A：分类的属性

类标签D：eg 是否买电脑

1.生成空的决策树，和测试属性表

2.选择一属性作为测试属性，测试属性的不同分支，将样本分为不同的子集。并删除该属性

3.如果子集同属一类，则为叶节点。

4.否则，对子集再进行CLS算法（2.3.4）

如何选择测试属性，便是不同算法的关键

2.ID3算法

核心：根据信息增益度（information gain）选择测试属性，信息增益度越高的A越优先

熵：

<img src="../../blog-assets/2026-08-08-artificial-intelligence-theory-notes/image-030.png" alt="image 030" />

<img src="../../blog-assets/2026-08-08-artificial-intelligence-theory-notes/image-031.png" alt="image 031" />

<img src="../../blog-assets/2026-08-08-artificial-intelligence-theory-notes/image-032.png" alt="image 032" />

互信息I（X，Y）：衡量X，Y的相关度

计算不同A和D之间的互信息，互信息（即信息增益）大的A优先选择
缺陷：容易偏向有多个取值的A

3.C4.5模型

核心：根据增益率（gain ratio）选择测试属性，增益率越高的A越优先

先求出信息增益度GainA，再求SplitinfoA，两者相除就是增益率

<img src="../../blog-assets/2026-08-08-artificial-intelligence-theory-notes/image-033.png" alt="image 033" />

4.CART模型（略）

核心：根据gini指数选择测试属性，使得gini指数越小的A越优先

Gini（D）指数求法，n为D的取值，即有多少个类

<img src="../../blog-assets/2026-08-08-artificial-intelligence-theory-notes/image-034.png" alt="image 034" />

支持向量机（SVM）

1.支持向量法：
将数据表示在多维空间中，然后用一个超平面将数据分为两类

2.评价分类器的好坏

VC维，结构风险=经验风险+置信风险

经验风险：在给定样本上的误差

置信风险：在多大程度上可以信任分类器在未知样本上分类的结果

样本数量越大，置信风险越小

<img src="../../blog-assets/2026-08-08-artificial-intelligence-theory-notes/image-035.png" alt="image 035" />

SVM：要最小化结构风险（两者之和）

3.线性分类器——感知机

可以分类线性可分的数据

## 深度学习

1.卷积神经网络
