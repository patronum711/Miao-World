---
title: "数字图像处理学习笔记"
description: "整理数字图像处理课程学习笔记，覆盖图像基础、灰度变换、滤波、复原、分割、形态学与频域处理等内容。"
publishedAt: 2026-08-08
tags: ["学习笔记", "数字图像处理"]
---
# 绪论

## 图像vs.数字图像

### 图像

“图”是光的分布，“像”是人脑对光的主管感知和认识。

数学定义：一个二维函数 f(x, y)，其中 (x, y)是空间坐标，f是该点的亮度（灰度）或颜色值。

### 数字图像

当x, y和f(x, y)都是​​离散且有限​​的数值时，该图像就是数字图像。

​​本质​​：它是一个​​离散的二元函数​​，在计算机中通常表示为​​矩阵或数组​​。

​​关键参数​​：​​分辨率​​（如512x512像素）和​​色彩深度​​（如每个颜色通道8比特）

## 数字图像处理及应用

### 概述

将图像视为矩阵，处理过程就是对矩阵进行数学运算。

研究范围覆盖全流程：成像 -> 存储与传输 -> 处理与分析 -> 显示

# 数字图像基础

## 视觉感知要素

### 人眼结构

<img src="../../blog-assets/2026-08-08-digital-image-processing-notes/image-001.png" alt="image 001" />

视网膜种包括两个光感受器：锥状体 (Cone) 和杆状体 (Rod)

锥状体（明视觉）：主要分布于视网膜中央凹部分，有自身神经末销，对色彩高度敏感

杆状体（暗视觉）：分布面积大，几个杆状体共享连接到一神经末销，捕获图像轮廓，没色觉，对低光照度敏感

两者在视网膜上的分布：

<img src="../../blog-assets/2026-08-08-digital-image-processing-notes/image-002.png" alt="image 002" />

### 人眼成像

晶状体具有自适应调节能力：

看远处物体，肌肉会迫使晶状体变得扁平，晶状体的聚焦中心向前移动；

看近处物体，则反之。

焦距越小，晶状体的折射能力越强，故近处物体的细节更加容易分辨。

### 亮度适应

人类视觉系统能够适应光强等级很宽：从暗阈值到强闪光约有1010个量级。

主观亮度(人视觉系统感知的亮度)是进入人眼光强的对数函数

### 马赫带效应图解

<img src="../../blog-assets/2026-08-08-digital-image-processing-notes/image-003.png" alt="image 003" />

### 光学错觉（略）

## 光和电磁波谱

### 光和电磁波谱

光是电磁波，而电磁波可用波长λ、频率ν、或能量E表示。

λ= c / ν

E=hν

波长越短，频率越大，能量越大，、。

电磁波谱如下：

<img src="../../blog-assets/2026-08-08-digital-image-processing-notes/image-004.png" alt="image 004" />

### 灰色图像和彩色图像：

单色光（单通道）：即无颜色的光，其唯一的属性为亮度

灰度图像：单通道

彩色图像：可用分别用多个单通道的灰度值表示各颜色分量，如RGB通道等。

## 图像感知与获取

### 图像传感器

单个数字传感器（点）；条形传感器（线）；阵列传感器（面）

### 图像传感器获取画面（略）

### 简单成像模型

灰度图像可以用一个二维函数f(x, y)表示，其中f(x, y)正比于物理源的辐射能量（如电磁波），是一个非负且有限的标量：

0 ≤ f(x, y) < +∞

f(x, y)有两个分量：

f(x, y) = i(x, y) r(x, y)

入射分量i(x, y)：入射到观察场景的光源总量和，大于等于0

反射分量r(x, y)：场景中物体反射光的总量，介于0到1之间

## 图像取样与量化

图像采样：对坐标值进行数字化

图像量化：对函数值进行数字化

### 坐标索引和线性索引

坐标索引：像素的位置由其二维坐标(x,y)给出的索引。

线性索引：由一个一维的非负整数串组成，这个非负整数串是通过计算到坐标(0, 0)的偏移量得到的。扫描方式包括：行扫描、列扫描。

### 空间分辨率

图像中可辨别的最小细节。

采样间隔越大，像素越少，空间分辨率越低，细节越少。

### 灰度分辨率

灰度级中可分辨的最小变化。

量化间隔越大，灰度分辨率越低。

一般用8 bit 存一个像素点的灰度值，即256个灰度值。

灰度分辨率和空间分辨率变化对比

<img src="../../blog-assets/2026-08-08-digital-image-processing-notes/image-005.png" alt="image 005" />

### 图像内插

用已知数据去估计未知位置的值的过程，主要用于图像放缩、旋转、几何校正等任务。

最近邻内插：把原图像中最近邻的灰度赋给了每个新位置，最简单但会造成严重的直边失真。

双线性内插：用4个最近邻点去估计给定位置的灰度，可给出比最近邻内插好得多的结果，但随之而来的是计算量的增加。注意：双线性内插不是一种线性内插方法。

双三次内插：用16个最近邻点，复杂度较高，在保持细节方面比双线性内插相对要好。

## 像素间的基本关系

### 相邻像素

<img src="../../blog-assets/2026-08-08-digital-image-processing-notes/image-006.png" alt="image 006" />

P点（x，y）

N4（p）：上下左右

ND（p）：对角线

N8（P）：前两者的并集

### 邻接

V为考察的灰度值集合。

4邻接：如果点q在N4(p)中，并q和p具有V中的数值，则q和p是4邻接的

8邻接：如果点q在N8(p)中，并q和p具有V中的数值，则q和p是8邻接的

M邻接：满足下列条件的任一个，则具有V中数值的p和q是m连接的。

--q在中N4(p)

--q在ND(p)中，且集合4() ∩ 4()中没有V值的像素。

## 数字图像处理的基本数学工具

### 算子：线性运算与非线性运算

算子H：H[ f (x, y)] = g(x, y)

若对任意图像f1、f2和a、b满足以下关系，则称算子是线性的，反之。

<img src="../../blog-assets/2026-08-08-digital-image-processing-notes/image-007.png" alt="image 007" />

### 算术运算

<img src="../../blog-assets/2026-08-08-digital-image-processing-notes/image-008.png" alt="image 008" />

以上算数均为对应像素运算，在f和g中的对应像素对之间执行。

### 几何变换

几何运算改变图像中像素的空间排列，通过预定义的一组规则来拉伸和收缩图像。由坐标空间变换和灰度插值两种基本运算组成。

1.坐标空间变换（仿射变换）

<img src="../../blog-assets/2026-08-08-digital-image-processing-notes/image-009.png" alt="image 009" />

<img src="../../blog-assets/2026-08-08-digital-image-processing-notes/image-010.png" alt="image 010" />

2.灰度插值

为空间变换后的像素赋予灰度

### 图像变换

<img src="../../blog-assets/2026-08-08-digital-image-processing-notes/image-011.png" alt="image 011" />

即转换到其他域（变换域）进行操作，最后再反变换回来。

# 灰度变换与空间滤波

## 背景/基本概念

1.空间域图像增强

g(x, y) = T ( f (x, y))

T的定义域:(x,y)的某个邻域

PS：g与f可以大小不一样，T也可以作用于多幅图像

2.灰度变换

当T的作用域为(x,y)点本身的灰度值时，此时称为灰度变换/点处理技术

S=T(r)

## 一些基本的灰度变换函数

大体上分为三类：

线性（反转和恒等变换）函数

对数（对数和反对数函数）函数

幂律（n次幂和n次根变换）函数

<img src="../../blog-assets/2026-08-08-digital-image-processing-notes/image-012.png" alt="image 012" />

### 反转变换

s=L-1-r（假设灰度级在区间[0,L-1]）

常用于增强图像暗色区域中的白色或灰色细节。

### 对数变换

s=clog（1+r）

该变换将输入中范围较窄的低灰度值映射，为输出中范围较宽的灰度级。

### 幂律（伽马）变换

s=crγ 其中，c和γ均为正常数

用作对比度增强处理

### 分段线性变换-对比度拉伸

<img src="../../blog-assets/2026-08-08-digital-image-processing-notes/image-013.png" alt="image 013" />

对比度拉伸-提高图像灰度级的动态范围，改善图像对比度。

### 分段线性变换-灰度级分层

<img src="../../blog-assets/2026-08-08-digital-image-processing-notes/image-014.png" alt="image 014" />

增强图中的特征

### 比特平面分层

<img src="../../blog-assets/2026-08-08-digital-image-processing-notes/image-015.png" alt="image 015" />

灰度值由8bit表示（256个值），每个bit表示0/1. 一张8比特灰度图像可以分割成8个位面(比特面)，高位层表示了主体信息，低位给出了不同程度的细节。

可以在低位层隐藏信息，但不改变原图片的主观感知。

## 直方图处理

### 概念

直方图容器：

<img src="../../blog-assets/2026-08-08-digital-image-processing-notes/image-016.png" alt="image 016" />

直方图：

<img src="../../blog-assets/2026-08-08-digital-image-processing-notes/image-017.png" alt="image 017" />

可看作离散型随机变量的概率密度

### 直方图反映图像特征

<img src="../../blog-assets/2026-08-08-digital-image-processing-notes/image-018.png" alt="image 018" />

### 直方图均衡化（特殊的直方图匹配）

图像灰度级可被视为区间[0, L− 1]的随机变量。在变换S= T(r)前后图像的概率密度函数分别设为 ：Ps(s) Pr(r)，则有：

<img src="../../blog-assets/2026-08-08-digital-image-processing-notes/image-019.png" alt="image 019" />

前提：

<img src="../../blog-assets/2026-08-08-digital-image-processing-notes/image-020.png" alt="image 020" />

则以下变换可实现直方图均衡化：

<img src="../../blog-assets/2026-08-08-digital-image-processing-notes/image-021.png" alt="image 021" />

<img src="../../blog-assets/2026-08-08-digital-image-processing-notes/image-022.png" alt="image 022" />

变换后的图像灰度是在[0,L-1]上的均匀变化（高对比度）

与连续形式不同，通常无法确保离散变换能产生均匀概率密度函数。

### 直方图匹配

在某些应用场景中，我们希望通过变换，使得直方图变换到规定的分布（不一定均匀）中。这一过程称之为直方图匹配/规定化。

给定原始图像Pr(r)和目标图像Pz(z)（非均匀），目标找到z=T(r)：

<img src="../../blog-assets/2026-08-08-digital-image-processing-notes/image-023.png" alt="image 023" />

算法：

<img src="../../blog-assets/2026-08-08-digital-image-processing-notes/image-024.png" alt="image 024" />

<img src="../../blog-assets/2026-08-08-digital-image-processing-notes/image-025.png" alt="image 025" />

### 局部直方图处理（均衡/规化）

一些统计量：

均值衡量明暗程度；方差衡量灰度变化程度

<img src="../../blog-assets/2026-08-08-digital-image-processing-notes/image-026.png" alt="image 026" />

<img src="../../blog-assets/2026-08-08-digital-image-processing-notes/image-027.png" alt="image 027" />

例子：

<img src="../../blog-assets/2026-08-08-digital-image-processing-notes/image-028.png" alt="image 028" />

## 空间滤波基础

### 线性空间滤波

<img src="../../blog-assets/2026-08-08-digital-image-processing-notes/image-029.png" alt="image 029" />

其中, w(s,t)为滤波器(或称核)的系数，参数a和b决定滤波器的大小为：

（2a+1）× (2b+1)，通常a=b

某点g(x,y)值的计算举例：

<img src="../../blog-assets/2026-08-08-digital-image-processing-notes/image-030.png" alt="image 030" />

线性空间滤波包含相关和卷积两种操作：

<img src="../../blog-assets/2026-08-08-digital-image-processing-notes/image-031.png" alt="image 031" />

相关：一般用于度量信号与信号之间的相似程度；

卷积：一般用于提取信号的特征

（对于对称的核，相关和卷积得到的结果是一致的。）

相关和卷积性质：

<img src="../../blog-assets/2026-08-08-digital-image-processing-notes/image-032.png" alt="image 032" />

### 可分离滤波核

<img src="../../blog-assets/2026-08-08-digital-image-processing-notes/image-033.png" alt="image 033" />

因此，上述性质可用于卷积快速计算：

<img src="../../blog-assets/2026-08-08-digital-image-processing-notes/image-034.png" alt="image 034" />

<img src="../../blog-assets/2026-08-08-digital-image-processing-notes/image-035.png" alt="image 035" />

### 对边界的空间滤波处理

<img src="../../blog-assets/2026-08-08-digital-image-processing-notes/image-036.png" alt="image 036" />

## 平滑（低通）空间滤波器

### 一般公式

<img src="../../blog-assets/2026-08-08-digital-image-processing-notes/image-037.png" alt="image 037" />

平滑通过对相邻像素求和（积分）实现

核w(s,t)即领域像素的权重，或者叫系数

### 盒式线性滤波器/一般线性平滑滤波器

<img src="../../blog-assets/2026-08-08-digital-image-processing-notes/image-038.png" alt="image 038" />

核越大，平滑效果越明显

### 低通高斯滤波核

高斯核函数（即一般公式中的w(s,t)）：

<img src="../../blog-assets/2026-08-08-digital-image-processing-notes/image-039.png" alt="image 039" />

<img src="../../blog-assets/2026-08-08-digital-image-processing-notes/image-040.png" alt="image 040" />

核大小一般小于或等于6σx 6σ，因为到中心距离大于3σ的概率非常接近0

高斯核的两大性质：

1.圆对称性

所有到中心距离为 r的点，它们的权重值都相同

2.可分离

<img src="../../blog-assets/2026-08-08-digital-image-processing-notes/image-041.png" alt="image 041" />

### 统计排序（非线性）滤波器

非线性的、非卷积滤波器。（不满足一般公式）

滤波原理：排序统计滤波器在滤波器包围的像素范围内排序，然后由统计排序结果决定的值代替中心像素的值。

分类：

中值滤波、最大值滤波、最小值滤波、第X百分点的滤波器。

中值滤波：

<img src="../../blog-assets/2026-08-08-digital-image-processing-notes/image-042.png" alt="image 042" />

## 高通（锐化）空间滤波器

锐化则用相邻像素差分（导数）来实现

<img src="../../blog-assets/2026-08-08-digital-image-processing-notes/image-043.png" alt="image 043" />

### 拉普拉斯滤波器（二阶差分/导数锐化）

将领域二阶差分值作为该点灰度值

<img src="../../blog-assets/2026-08-08-digital-image-processing-notes/image-044.png" alt="image 044" />

常见的拉普拉斯滤波核：

<img src="../../blog-assets/2026-08-08-digital-image-processing-notes/image-045.png" alt="image 045" />

特点：

1. 中心对称；2. 中间值的绝对值大； 3. 和为零。

滤波后孤立点、线等被突出，常与原图叠加：

<img src="../../blog-assets/2026-08-08-digital-image-processing-notes/image-046.png" alt="image 046" />

### 梯度（一阶微分锐化）

将梯度大小作为该点灰度值。

梯度定义：一个向量（有方向有大小）

<img src="../../blog-assets/2026-08-08-digital-image-processing-notes/image-047.png" alt="image 047" />

通常采用L1定义作为梯度大小定义

常见算子：

<img src="../../blog-assets/2026-08-08-digital-image-processing-notes/image-048.png" alt="image 048" />

### 钝化屏蔽

<img src="../../blog-assets/2026-08-08-digital-image-processing-notes/image-049.png" alt="image 049" />

## 低通、高通、带阻、带通滤波器

<img src="../../blog-assets/2026-08-08-digital-image-processing-notes/image-050.png" alt="image 050" />

## 组合使用空间增强（略）

# 频率域滤波

## 信号与系统基础

注意：使用的频率u而非角频率w

复习：

常见信号

复数

傅里叶级数（周期：复指数形式、三角形式）

傅里叶变换（非周期、周期）

傅里叶变换性质

傅里叶变换对

采样（周期冲激串采样后函数的傅里叶变换=原函数傅里叶变换的周期延拓）

信号恢复

新增：

二维

## 频率域滤波基础

<img src="../../blog-assets/2026-08-08-digital-image-processing-notes/image-051.png" alt="image 051" />

<img src="../../blog-assets/2026-08-08-digital-image-processing-notes/image-052.png" alt="image 052" />
