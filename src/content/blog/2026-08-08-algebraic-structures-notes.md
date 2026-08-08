---
title: "代数结构知识点"
description: "整理代数结构课程知识点，覆盖代数系统、群、环、域、同态、同构与相关代数性质。"
publishedAt: 2026-08-08
tags: ["学习笔记", "代数结构"]
---
# 第一讲 代数一般概念回顾

1.集合上的运算

S的二元运算：

<img src="../../blog-assets/2026-08-08-algebraic-structures-notes/image-001.png" alt="image 001" />

S的N元运算：

<img src="../../blog-assets/2026-08-08-algebraic-structures-notes/image-002.png" alt="image 002" />

运算本质是函数

2.运算的封闭性

S的运算一定要满足封闭性

3.运算的性质和特殊元素

一个运算可能满足：交换律、结合律、幂等律、消去律

两个运算之间可能满足：分配律、吸收律

特殊元素：单位元和零元，逆元（对单位元的运算）

4.代数的定义

集合（基集）+这个集合上的一些运算

5.子代数

基集的子集，必须满足对原代数的所有运算封闭

真子代数对应真子集

6.代数的生成元

代数基集的任意元素都可以用过生成元进行代数的运算得到

7. 代数上的同余关系

首先是1.基集上的等价关系 2.且与代数的所有运算可置换(判断：a R b,  c R d,则 a 运算 c R b 运算 d)

8.商代数

过渡：同余关系把原集合分成了若干组，商代数就是定义了这些组之间的运算

基集：商集（同余关系划分的等价类的集合）所以每个元素是集合

运算：定义在这些组之间的运算

重要关系：等价类做商代数运算（结果是一个集合）=等价类的代表做原代数运算的结果（是个元素）所在的等价类

9.两个代数的同态

首先1.是两个基集之间的函数 2.对代数的所有运算可交换（判断： 先运算再映射与先映射再运算结果一致）

10.两个代数同构

1.若两个代数存在同态 2.且同态是双函数

11.代数同态基本定理

暂时略

# 第二讲 群与子群基础知识

1.群的定义

1.是个代数（有基集G和二元运算）

2.运算满足结合律，存在单位元属于G

3.每个元素都有逆元

（故群自然有三个运算：二元运算 零元运算e 一元运算()^-1）

(表先看列后看行)

2.群的一些术语

阿尔贝群（交换群）：满足交换律的群

群的阶：G的元素个数（可以无穷）

两类典型群（加群和乘群

3.群的一些性质

群都有单位元，因此不可能是空集

群（除了平凡群），都没有零元e（用e表示零元）

<img src="../../blog-assets/2026-08-08-algebraic-structures-notes/image-003.png" alt="image 003" />

<img src="../../blog-assets/2026-08-08-algebraic-structures-notes/image-004.png" alt="image 004" />

4.群的幂运算

<img src="../../blog-assets/2026-08-08-algebraic-structures-notes/image-005.png" alt="image 005" />

5.群元素的阶

a的阶 |a|=k, 𝒂^𝒌=𝒆 (最小的k)

6.群元素阶的性质

若a的阶为n，则：

故只要知道元素的阶就可以算出元素的任意次幂

<img src="../../blog-assets/2026-08-08-algebraic-structures-notes/image-006.png" alt="image 006" />

有限群的元素的阶是群的阶的因子：如果𝑮是有限群，且|𝑮| = 𝒎，则∀𝒂∈𝑮, |𝒂|  | 𝒎

7.子群的定义

H是G的子集，且对G的运算也构成群，则称H是G的子群（子群对群的三个运算自然也封闭）

8.子群判定定理

A.充要：(1) ∀𝒂∈𝑯, 𝒂^(−𝟏)∈𝑯; 且(2) ∀𝒂, 𝒃∈𝑯, 𝒂𝒃∈𝑯

B充要：∀𝒂, 𝒃∈𝑯, 𝒂𝒃^(−𝟏)∈𝑯 （重要）

9.生成子群（群的子集的）

定义：群的基集G的子集S的生成子群&lt;S&gt;就是包含这个子集的最小的子群

（子群的交总还是子群）

故&lt;S&gt;=所有包含S的子群的交

10.生成子群的形式:略

H K两个子群的交仍然是子群，且其阶为H K的

# 第三讲 循环群与置换群

1.循环群的定义

循环群是 一个元素生成的群

G是循环群，则

存在这个a为G的元素（a称为生成元）

<img src="../../blog-assets/2026-08-08-algebraic-structures-notes/image-007.png" alt="image 007" />

G有n个元素，称为n阶循环群

PS<>有两个含义，一个是元素的生成群，一个是子集的生成子群

2.循环群的定理

A.若G=&lt;a&gt;(说明是由a生成的，至少有a这个生成元)

a.若G是无限群，则a和a^-1是两个仅有的生成元

b.如果G是n阶群，则有个生成元（个数）；（生成元有谁）a^r次方，(n,r)=1（互质）

<img src="../../blog-assets/2026-08-08-algebraic-structures-notes/image-008.png" alt="image 008" />

B.任意·循环群的任意子群都是循环群

C.

<img src="../../blog-assets/2026-08-08-algebraic-structures-notes/image-009.png" alt="image 009" />

D. 若G=&lt;a&gt;

a.若G是无限群，则全部的子群为，且除了d=0时生成的平凡群，其他的子群都是无线循环群

<img src="../../blog-assets/2026-08-08-algebraic-structures-notes/image-010.png" alt="image 010" />

b.如G是n阶群，则全部的子群为

<img src="../../blog-assets/2026-08-08-algebraic-structures-notes/image-011.png" alt="image 011" />

3.置换及乘积

置换：是一个双函数, S={1,2,3,4,…,n}，S->S

一般写法

<img src="../../blog-assets/2026-08-08-algebraic-structures-notes/image-012.png" alt="image 012" />

恒等置换：

<img src="../../blog-assets/2026-08-08-algebraic-structures-notes/image-013.png" alt="image 013" />

逆置换：

<img src="../../blog-assets/2026-08-08-algebraic-structures-notes/image-014.png" alt="image 014" />

置换的乘积：两个置换的复合（本质是函数的复合）

4.置换群的定义

基集G：置换，本质是函数（再本质是关系&lt;a,伽马(a)&gt;）

运算：置换的乘法

单位元：恒等置换

构成的这个群叫做n元对称群（n为S里面的n），记为Sn，其任意子群都叫做n元置换
PS：注意理解Sn的基集装的是置换，每个置换是n元（函数），不意味着Sn就有n个元素

5.轮换

1.是一种特殊的置换 2.伽马(1)=2 这种规则  （只针对k个元素 其他元素不变，这k个元素任意顺序 可以不相邻）

称为S上的k阶轮换（2阶轮换也称为对换）（PS：k阶轮换仍然是n元函数，只是只有其中k个元素有发生变换）

不相交的轮换：作用的元素不相交，都不同

两个不相交的轮换可以交换乘积顺序

6.置换的对换表示

任意的置换都可以表示为不相交的轮换的乘积，而轮换都可以表示为对换的乘积。

（方法1）

<img src="../../blog-assets/2026-08-08-algebraic-structures-notes/image-015.png" alt="image 015" />

方法2：𝒌阶轮换(𝒊_𝟏 𝒊_𝟐 𝒊_𝟑⋯𝒊_𝒌 )也等于(𝒊_𝟏 𝒊_𝒌 )(𝒊_𝟏 𝒊_(𝒌−𝟏) )⋯(𝒊_𝟏 𝒊_𝟐 )

（一个置换的轮换是唯一的，但轮换到对换是不唯一的）

7.奇置换与偶置换

置换可表示为对换的个数

奇数：奇置换

偶数：偶置换

（任何两个偶置换的积是偶置换；两个奇置换的积是偶置换；一个偶置换与一个奇置换的积是奇置换。一个偶置换的逆置换仍然是偶置换，一个奇置换的逆仍然是奇置换）

8.交错群

N元对称群Sn（G装的是置换），其中偶置换构成的子群称为n元交错群

# 第四讲 子群的陪集

1.群的子集的运算

群G的两个非空子集A、B为群的子集

运算为AB，称为AB的乘积={𝒂𝒃|𝒂∈𝑨, 𝒃∈𝑩 }(ab不是*运算，是该群的二元运算)

（如果其中一个集合如A只有一个元素g，AB可简记为gB）

（交换群有AB=BA）

2.群子集运算的性质

𝑨, 𝑩, 𝑪是群𝑮的非空子集，𝒈是群𝑮的一个元素，则（都是集合相等）：

群的子集运算满足结合律：𝑨(𝑩𝑪) = (𝑨𝑩)𝑪

𝒈𝑨 = 𝒈𝑩或𝑨𝒈 = 𝑩𝒈，则𝑨 = 𝑩

若𝑩⊆𝑪，则有𝑨𝑩⊆𝑨𝑪和𝑩𝑨⊆𝑩𝑪

𝑯是群𝑮的子群，则𝑯𝑯 = 𝑯（子群的封闭性）

𝑨,𝑩是群𝑮的两个子群，则𝑨𝑩也是群𝑮的子群当且仅当𝑨𝑩 = 𝑩𝑨

3.子群的陪集的定义

G是群，H是子群

对G中任意的元素a，aH和Ha分别称为H在G中的左陪集和右陪集

4.子群的培集的性质

<img src="../../blog-assets/2026-08-08-algebraic-structures-notes/image-016.png" alt="image 016" />

<img src="../../blog-assets/2026-08-08-algebraic-structures-notes/image-017.png" alt="image 017" />

5.子群陪集导出等价关系

H是群G的子群，定义二元关系R（G*G）

(R的确定/导出规则)

<img src="../../blog-assets/2026-08-08-algebraic-structures-notes/image-018.png" alt="image 018" />

则R是等价关系，且[a]R=Ha

6.集合等势

若两个集合之间存在双函数，则称它们等势（有限集就是元素个数相等）

（Ha 与 H 与 aH 元素个数相同 三个集合等势）

7.子群陪集的集合

𝑮/𝑯={𝒈𝑯∣𝒈∈𝑮} 𝑯\𝑮={𝑯𝒈∣𝒈∈𝑮}分别是H的所有左陪集和所有右陪集构成的集合

是双函数，故𝑮/𝑯和𝑯\𝑮等势

<img src="../../blog-assets/2026-08-08-algebraic-structures-notes/image-019.png" alt="image 019" />

8.子群的指标

子群𝑯在群𝑮中的左陪集或右陪集的个数，记为[𝑮:𝑯]

9.拉格朗日定理

|G|=|H||G:H|

10.群元素的阶是群的阶的因子（同第二讲6）

|a|是n的因子，故a^n=e(由a^|a|=e群元素阶的本质定义)

并不是群的阶n的每一个因子都存在群里的元素的阶与之对应

如果一个群的阶是 n，并且存在一个元素的阶也是 n，那么这个群一定是循环群

群G的一个n阶元素生成的群必然是n阶循环子群

# 第五讲 正规子群与商集

1.正规子群（不变子群）的定义

首先，𝑯是群𝑮的子群

并且，如果∀𝒂∈𝑮都有𝑯𝒂 = 𝒂𝑯（注意是集合相等）

记作𝑯⊴𝑮

（自然语言：设𝑯是群𝑮的子群，如果𝑯的任意一个左陪集也是它的一个右陪集，则𝑯是𝑮的正规子群）

2.平凡正规子群

有1.群𝑮的单位元子群{𝒆} 2.群𝑮本身都是𝑮的正规子群

3.单群

𝑮只有平凡正规子群，且𝑮≠{𝒆}

4.正规子群的性质

1.交换群𝑮（满足交换律）的任意子群都是𝑮的正规子群

2.𝑯, 𝑲都是𝑮的子群，𝑯是𝑮的正规子群，且𝑯⊆𝑲，则𝑯也是𝑲的正规子群。

3.𝑯是𝑮的正规子群，𝑲是𝑯的正规子群，但𝑲不一定是𝑮的正规子群

4.𝑯, 𝑲是𝑮的正规子群，则𝑯∩𝑲和𝑯𝑲也都是𝑮的正规子群

5.正规子群的判定

<img src="../../blog-assets/2026-08-08-algebraic-structures-notes/image-020.png" alt="image 020" />

<img src="../../blog-assets/2026-08-08-algebraic-structures-notes/image-021.png" alt="image 021" />

6.商群G/H的定义

𝑮为群，𝑯是𝑮的正规子群，H的陪集不需要区分左右

基集：G/H，装的是集合，即H的所有的陪集

运算：∀𝑵𝒂, 𝑵𝒃, 𝑵𝒂∘𝑵𝒃 = 𝑵𝒂𝒃

7.商群的性质

1. 设𝑮是交换群，𝑯是𝑮的子群，则商群𝑮/𝑯也是交换群。

2. 有限群𝑮的商群的阶是群𝑮的阶的因子（拉格朗日）

# 第六讲 群的同态与同构

1.群同态的定义

(1)是函数。G与G’是两个群，f: G->G’, f(ab)=f(a)f(b)，f称为同态。

(2)是一种抽象关系（群之间的）

<img src="../../blog-assets/2026-08-08-algebraic-structures-notes/image-022.png" alt="image 022" />

若两个集合相等，称为自同态。

2.群同态的性质

<img src="../../blog-assets/2026-08-08-algebraic-structures-notes/image-023.png" alt="image 023" />

3.群的内自同构

<img src="../../blog-assets/2026-08-08-algebraic-structures-notes/image-024.png" alt="image 024" />

4.群G由元素a确定的左平移

是置换（函数），且是双函数，

<img src="../../blog-assets/2026-08-08-algebraic-structures-notes/image-025.png" alt="image 025" />

5.群G的左正则表示

，也是一个置换群

<img src="../../blog-assets/2026-08-08-algebraic-structures-notes/image-026.png" alt="image 026" />

6.凯莱定理

每个群都有一个与之同构的置换群，即其左正则表示群。

同构函数为：

<img src="../../blog-assets/2026-08-08-algebraic-structures-notes/image-027.png" alt="image 027" />

（G中元素为数，Gl中元素为函数（置换））

7.循环群结构定理

<img src="../../blog-assets/2026-08-08-algebraic-structures-notes/image-028.png" alt="image 028" />

同构函数分别为：

<img src="../../blog-assets/2026-08-08-algebraic-structures-notes/image-029.png" alt="image 029" />

<img src="../../blog-assets/2026-08-08-algebraic-structures-notes/image-030.png" alt="image 030" />

8.群同态的性质

(1)与元素的阶

<img src="../../blog-assets/2026-08-08-algebraic-structures-notes/image-031.png" alt="image 031" />

(2)群同态与子群

<img src="../../blog-assets/2026-08-08-algebraic-structures-notes/image-032.png" alt="image 032" />

(3)与正规子群

9.群同态的核

<img src="../../blog-assets/2026-08-08-algebraic-structures-notes/image-033.png" alt="image 033" />

是个集合，满足以下

<img src="../../blog-assets/2026-08-08-algebraic-structures-notes/image-034.png" alt="image 034" />

就是核，称为Ker(fi同态函数)

10.群同态的核性质

1.

<img src="../../blog-assets/2026-08-08-algebraic-structures-notes/image-035.png" alt="image 035" />

2.

<img src="../../blog-assets/2026-08-08-algebraic-structures-notes/image-036.png" alt="image 036" />

11.群同态基本定理

前者是商群

<img src="../../blog-assets/2026-08-08-algebraic-structures-notes/image-037.png" alt="image 037" />

# 第八讲 环的定义与基本性质

1.环的定义

<img src="../../blog-assets/2026-08-08-algebraic-structures-notes/image-038.png" alt="image 038" />

2.环的零元与单位元

环的单位元：乘法的单位元（不一定有）

环的零元：乘法的零元

## 有如下性质

元素的负元：对加法的逆元

<img src="../../blog-assets/2026-08-08-algebraic-structures-notes/image-039.png" alt="image 039" />

3交换环

## 环乘法也满足交换律的环

4有单位元环

## 环乘法也有单位元的环

5可逆元（环的单位）

对有单位元环，存在a和b，使得：

ab=ba=e(e为乘法的单位元)

则a为可逆元，b是a的逆元

6环R的单位群U(R)

对有单位元群，

所有可逆元的集合+环乘法构成的群

7零因子

非零元素ab，若ab=0

则a为左零因子，b为右零因子，统称为零因子

8零环处理

通常排除零环，默认环至少有两个元素，则0不可能是单位元和可逆元

9整环

有单位元、无零因子、交换的环

10除环

有单位元、每个非零元素都可逆的元

除环+可交换=域（域一定是整环）

除环+不可交换=体

11环的例子
