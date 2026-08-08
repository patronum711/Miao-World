---
title: "计算机组成原理期末复习笔记"
description: "整理计算机组成原理期末复习内容，覆盖计算机系统概述、指令系统、处理器、存储层次、I/O 与并行等知识点。"
publishedAt: 2026-08-08
tags: ["学习笔记", "计算机组成原理", "复习"]
---
## 第一章 计算机概要与技术

### 习题：

性能评价（1.4 P57 P61 P65 P71 P79 P80）

并行计算加速比（1.5 P29）

作业习题

### 1.1  概述

<img src="../../blog-assets/2026-08-08-computer-organization-review-notes/image-001.png" alt="image 001" />

计算模型：图灵机 图灵（计算机科学之父）

物理器件：二值电子器件

大规模集成：集成电路 摩尔定律（晶体管数量翻倍，性能也翻一倍）

存储程序：冯诺依曼体系

操作系统：虚拟化计算机（进程）虚拟化内存（虚存）虚拟化外存（文件）

互联网：包交换技术

多媒体：

人工智能：图灵（人工智能之父）图灵测试

计算机分类：PC 服务器 超算 嵌入式计算机

现代程序员需要理解的是内存层次化特性和处理器并行化特点

### 1.2 程序的表层下

硬件：具体的物理器件

软件：程序（数据结构+算法）+文件

系统软件：操作系统 编译器 汇编器

计算机层次结构：

<img src="../../blog-assets/2026-08-08-computer-organization-review-notes/image-002.png" alt="image 002" />

指令系统是软硬件的交界面，不同用户再不同层次看到的计算机不一样

程序执行过程：预处理、编译、汇编、链接

<img src="../../blog-assets/2026-08-08-computer-organization-review-notes/image-003.png" alt="image 003" />

### 1.3 打开机箱

冯.诺依曼计算机框架：运算器、控制器、存储器、输入设备和输出设备

GRS：通用寄存器 PC：存放下指令的地址 IR：存放当前指令本身

### 1.4 性能评价

1.完成单任务的时间：响应时间

2.单位时间完成的任务：吞吐率（单位时间完成的任务量）带宽

性能=1/执行时间

响应时间>CPU（执行）时间：a.系统CPU时间（系统性能） b.用户CPU时间（CPU性能）

<img src="../../blog-assets/2026-08-08-computer-organization-review-notes/image-004.jpg" alt="image 004" />

综合考虑三因素

光看CPI不能反映CPU性能

算法、语言、编译器等影响CPI和指令数，指令集结构影响指令数、CPI、时钟频率

MIPS：每秒执行的百万指令数

### 1.5 功耗

主流集成电路技术：CMOS

动态功耗：晶体管翻转时消耗能量

<img src="../../blog-assets/2026-08-08-computer-organization-review-notes/image-005.jpg" alt="image 005" />

### 1.6 发展

单处理器提升性能手段：提高主频和发掘指令级并行（ILP）

多处理器：频率墙、功耗墙限制->多处理器

并行计算加速比公式：

<img src="../../blog-assets/2026-08-08-computer-organization-review-notes/image-006.png" alt="image 006" />

性能提高有上限，取决于串行部分所占比例

## 第二章 指令

### 习题：

变长指令码（2.2.2 P37）

寻址方式（2.3.2 P63 P64）

指令综合设计（2.3.3 P74 P77 P84 补充题）

浮点数转换（2.4.3 P43 P44）

MIPS指令系统（2.5.2 补充题）

作业习题

### 2.1 什么是指令

#### 2.1.1 指令系统概述

设计原则：完备 有效 规整 兼容

#### 2.1.2 CISC与RISC

CISC：复杂指令集计算机

RISC：精简指令集计算机

RISC特点：

1.简化的指令系统

2.优化的编译系统

3.以寄存器-寄存器方式工作

4.采用大量通用寄存器（减少访存次数）

5.采用组合逻辑电路控制（不用少用微程序）

6.指令周期短

CISC：x86（但借鉴了RISC）

RISC:：ARM MIPS RISC-V SPARC

### 2.2 指令格式

#### 2.2.1 指令格式

操作码+寻址方式+地址码/立即数

1.指令长度：

定长指令字(RISC)

变长指令字(CISC)

2.操作码

定长操作码

变长（扩展）操作码

指令长度是否可变与操作码长度是否可变无绝对联系

#### 2.2.2 操作码设计

<img src="../../blog-assets/2026-08-08-computer-organization-review-notes/image-007.png" alt="image 007" />

#### 2.2.3 地址码结构

二地址（最常用） 三地址（RISC风格）

### 2.3 寻址方式

#### 2.3.1 寻址方式概念

1.指令寻址：

正常：PC+4

跳转

2.操作数寻址

#### 2.3.2 操作数基本寻址方式

<img src="../../blog-assets/2026-08-08-computer-organization-review-notes/image-008.jpg" alt="image 008" />

<img src="../../blog-assets/2026-08-08-computer-organization-review-notes/image-009.jpg" alt="image 009" />

9.堆栈寻址

堆栈：一段内存区域

SP：一个寄存器，指向栈顶

Push：从寄存器到堆栈（内存）

Pop：从堆栈（内存）到寄存器

#### 2.3.3 复合寻址

### 2.4 数据表示

#### 2.4.1 机器级数据表示

位-字节-字

#### 2.4.2 数据的定点表示

补码的理解：

<img src="../../blog-assets/2026-08-08-computer-organization-review-notes/image-009.jpg" alt="image 009" />

#### 2.4.3 数据的浮点表示

<img src="../../blog-assets/2026-08-08-computer-organization-review-notes/image-009.jpg" alt="image 009" />

#### 2.4.4 十进制表示

BCD码（8421码）

#### 2.4.5 字符的表示

#### 2.4.6 数据的度量和储存

1.度量：

KB 210字节 10的3次方

MB 220字节 10的6次方

GB 230字节 10的9次方

TB 240字节 10的12次方

2.存放：

(1)存放方式

a.大端对齐：低位在高地址

b.小端对齐：低位在低地址

(2)边界对齐

地址为其所占空间的倍数

(eg int 4字节 地址只能是4的倍数 short 地址只能是2的倍数)

#### 2.4.7 数据检验/纠错

奇偶校验码（只能发现奇数位出错，不具备纠错能力）

#### 2.4.8 基本指令类型

数据传输

算术运算

逻辑运算

程序控制

系统控制

输入输出

子程序调用：要求返回，可嵌套递归，不同程序间转移

转移：不要求返回，同一程序内转移

子程序调用实现：

单寄存器：不支持嵌套和递归

多寄存器：支持嵌套，不支持递归

堆栈：支持嵌套和递归

### 2.5 程序的机器级表示

#### 2.5.1 MIPS指令系统介绍

1.MIPS指令格式

R-Type op+rs+rt+rd+shamt+funct

I-Type op+rs+rt+immediate

J-Type op+target address

2.寻址方式：立即数寻址 寄存器直接 基址寻址

CF（进/借位）OF（溢出）ZF（零标志）SF（符号标志）

## 第三章 计算机中的运算

### 习题：

（P43 P44 P59 P79）

### 3.1 基本运算

#### 3.1.1 按位运算

按位与&、或|、取反~、异或^

掩码等操作

#### 3.1.2 逻辑运算

逻辑与&&、或||、非！

#### 3.1.3 移位运算

无符号数：逻辑左右移 高/低位移出，低/高位补0

（若左移高位移出1 溢出）

有符号数：算术左右移 高位移出，低位补0；低位移出，高位补符

（若左移溢出的位不等于新的符号位 溢出）

位扩展：

无符号数0拓展前面补0 有符号数前面符号拓展补符

### 3.2 加减法

1.无符号

2.有符号原码加法：符号位和数值部分分别处理

同号：数值位相加，符合位取同号

异号：负数取补码与正数相加（数值位也要加）

a.最高数值位产生进位，符号位为0，正确

b.最高数值位没有进位，符号位为1，求补码，得到原码

3.有符号补码加法：

任意两数补码相加等于这两个数和的补码

[A+B]=[A]+[B]

4.有符号补码减法

[A-B]=[A]+[-B]

溢出：

正溢出

负溢出

溢出检测：

采用变形补码

移码加减运算

## 第4章 CPU

### 习题：
单周期CPU性能（4.4）

多周期CPU性能（4.5）

流水线性能（4.5）

三者性能比较（4.5末）

直接控制法和字段直接编码（4.11）

流水线数据相关性分析（4.11补充题）

本章怎么考（4.11末）

### 4.1概述

CPU由数据通路（组合逻辑原件ALU+存储状态元件）和控制器构成

### 4.2 逻辑设计规则

组合逻辑元件特点：输出只取决输入，是即时的（有延迟）

状态元件特点：输入由时钟决定何时写入，输出即时，有建立和保持时间和延迟(Clk-to-Q)

状态元件分为寄存器和存储器

多总线数据通路：一个周期内可传送多个数据，提高效率

### 4.3 数据通路的建立

<img src="../../blog-assets/2026-08-08-computer-organization-review-notes/image-010.png" alt="image 010" />

<img src="../../blog-assets/2026-08-08-computer-organization-review-notes/image-011.png" alt="image 011" />

<img src="../../blog-assets/2026-08-08-computer-organization-review-notes/image-012.png" alt="image 012" />

<img src="../../blog-assets/2026-08-08-computer-organization-review-notes/image-013.png" alt="image 013" />

### 4.4 单周期控制器

<img src="../../blog-assets/2026-08-08-computer-organization-review-notes/image-014.png" alt="image 014" />

<img src="../../blog-assets/2026-08-08-computer-organization-review-notes/image-015.png" alt="image 015" />

<img src="../../blog-assets/2026-08-08-computer-organization-review-notes/image-016.png" alt="image 016" />

<img src="../../blog-assets/2026-08-08-computer-organization-review-notes/image-017.png" alt="image 017" />

<img src="../../blog-assets/2026-08-08-computer-organization-review-notes/image-018.png" alt="image 018" />

### 4.5 多周期控制器数据通路和控制器

数据通路：

<img src="../../blog-assets/2026-08-08-computer-organization-review-notes/image-019.png" alt="image 019" />

<img src="../../blog-assets/2026-08-08-computer-organization-review-notes/image-020.png" alt="image 020" />

分两种：周期末时钟打进去；上周期准备好地址和内容，下周期使能信号为1立即进入

PPT中Reg和Mem都没Clk了

一个ALU和Mem，增加了MUX和一个IR寄存器和Target投机寄存器

PCWr 和IRWr只有第一周期为1

TargetWr第二周期为1（存放投机结果）

PCWrCond第三周期beq为1

<img src="../../blog-assets/2026-08-08-computer-organization-review-notes/image-021.png" alt="image 021" />

可以看到第二个周期，寄存器被读出后被Mux截断

Beq，jump：三个周期 （beq不投机的话4个周期）
Rtype：四个周期，第三周期Reg地址信号为1（第四周期写回，Wr为1，地址信号继续保持）

Sw：四个周期，第三周期只有ALU相关控制信号，地址不需选择，直接送达，第四个周期写存MemWr为1，

Lw：五个周期，第三周期只有ALU相关控制信号，地址被阶段，第四周期访存，ID选择信号，Red位选信号准备，第五周期写回Reg，RegWr为1

<img src="../../blog-assets/2026-08-08-computer-organization-review-notes/image-022.png" alt="image 022" />

### 4.6 流水线数据通路和控制器（多周期与流水线分开！）

提高主频-降低周期-增加流水线级数-增加寄存器开销

<img src="../../blog-assets/2026-08-08-computer-organization-review-notes/image-023.png" alt="image 023" />

平均CPI为1（N+4/N的极限）

<img src="../../blog-assets/2026-08-08-computer-organization-review-notes/image-024.png" alt="image 024" />

Reg被看作两个部件（周期开始写部件 周期末读部件）

1.结构冒险/资源冒险 （避免 每个部件特定阶段使用）

A.硬件阻塞Bubble

B.NOP（空操作）对R指令（MEM为空操作）对SW（Wr为空操作）对beq Exec阶段要ALU比大小 Adder计算转移地址（或投机）Mem 用来转移目标地址（不投机的话） Wr为空操作

4.7 2.数据冒险/数据相关

A.硬件阻塞（Bubble） （可解决lw指令 mem读出的结果 必须阻塞一个时钟）

B.插入NOP指令

C.转发旁路技术 （可解决ALU结果的转发）

D.指令静态调度：编译优化指令顺序

（PS：技巧 lw指令后面紧跟冲突必须阻塞一个周期 其他情况均可旁发解决）

4.8 3.控制冒险/分支冒险/转移冒险

A.阻塞Bubble

B.NOP

C.静态或动态分支预测（静态和动态：利用最近转移发生的情况预测下一次可能发生的转移）

D.指令静态调度：编译优化指令顺序（实现分支延迟：把分支前的与分支指令无关的指令调到分支指令后执行）

### 4.9异常处理

CPU执行原程序，转去处理异常的程序执行，执行完再返回到原被中止的程序

异常：控制流中任何意外的改变包括处理器内外部

中断：只适用于外部事件

内部异常：

1.硬故障中断：电源掉电、硬件线路故障

2.程序性中断：执行某指令的异常（溢出缺页越界越权非法指令/0端点单步系统调用）

A.故障（e指令引起 如溢出缺页访问超时）

B.自陷

C.终止

外部中断：

CPU外发生的特殊事件，由中断请求信号发给CPU处理

外中断通过中断请求线

INTR：可屏蔽中断

NMI：不可屏蔽中断（无条件响应）

每个事件有中断类型号，根据其找到相应的中断服务程序

异常处理机制：

1.关中断：处于“禁止中断：状态，防止新中断破坏断点现场

2.保护断点和程序状态：将断点和程序状态保护到堆栈或特殊寄存器

3.识别异常事件：软件（非向量）和硬件识别（向量中断）

<img src="../../blog-assets/2026-08-08-computer-organization-review-notes/image-025.png" alt="image 025" />

MIPS实例

数据通路增加两个寄存器：

EPC：存放断点（异常处理完回到的指令地址），32位。可能是正在执行的指令（故障PC-4），下条指令（自陷和中断 直接送PC）

Cause：存放异常原因，32位

加入两个寄存器的写使能控制信号

<img src="../../blog-assets/2026-08-08-computer-organization-review-notes/image-026.png" alt="image 026" />

加入一控制信号：选择正确的值写到Cause中

将异常查询程序（表）的入口地址写入PC 开始查询对应中端服务的入口地址

流水线处理：

<img src="../../blog-assets/2026-08-08-computer-organization-review-notes/image-027.png" alt="image 027" />

### 4.10 指令级并行

指间存在的相关性

1.结构相关/冒险

不同指令同时存取相同的寄存器或存储器

2.数据相关/冒险

某条指令的操作数依赖前一条或前几条指令的运行结果

写后读RAW 读后写WAR 写后写WAW

3.控制相关/冒险（可看作PC的RAW问题）

实现多发射处理器的两种方法：
1.静态多发射：执行前，由编译器帮助封装多条指令并处理冒险

<img src="../../blog-assets/2026-08-08-computer-organization-review-notes/image-028.png" alt="image 028" />

超长指令字：编译器选择可以并行执行的指令

<img src="../../blog-assets/2026-08-08-computer-organization-review-notes/image-029.png" alt="image 029" />

2.动态多发射：运行时，由处理器发射多条指令并冒险

超标量处理器：

<img src="../../blog-assets/2026-08-08-computer-organization-review-notes/image-030.png" alt="image 030" />

<img src="../../blog-assets/2026-08-08-computer-organization-review-notes/image-031.png" alt="image 031" />

前面是指令级并行，后面是线程级并行

1.超线程技术

2.多核技术

### 4.11 微程序控制器设计

基本思想：指令->微程序<-微指令（状态）<-微命令（控制信号）

微程序放在控制存储器控存CS中（只读存储器ROM），执行指令取出对应各微指令，译码产生微命令，即控制信号。

特点：规整、可维护、灵活，但速度慢

微指令->微命令（控制信号）->微操作（执行部件）

<img src="../../blog-assets/2026-08-08-computer-organization-review-notes/image-032.png" alt="image 032" />

<img src="../../blog-assets/2026-08-08-computer-organization-review-notes/image-033.png" alt="image 033" />

微指令周期：读取一条微指令并执行完微操作所需要的时间

微指令周期是固定的，而指令周期时间可以变化

静态/动态微程序设计

微指令格式设计

<img src="../../blog-assets/2026-08-08-computer-organization-review-notes/image-034.png" alt="image 034" />

1.直接控制法

每一个微命令用一位信息表示

<img src="../../blog-assets/2026-08-08-computer-organization-review-notes/image-035.png" alt="image 035" />

2.字段直接编码

<img src="../../blog-assets/2026-08-08-computer-organization-review-notes/image-036.png" alt="image 036" />

3.字段间接编码

<img src="../../blog-assets/2026-08-08-computer-organization-review-notes/image-037.png" alt="image 037" />

4.最短编码（垂直型，前三种水平型）

<img src="../../blog-assets/2026-08-08-computer-organization-review-notes/image-038.png" alt="image 038" />

下一条微地址的确定方式

1.顺序转移法（计数器法）：下条微指令地址隐含在微程序计数器微PC中

2.断定（下址字段）法：当前微指令中显示指定下条微指令地址

一个微程序的所有指令执行完后->执行取指微程序（从头到尾执行微指令）->转移到下条指令对应微程序的首微指令地址。

每一条微指令的下地址又有三种情况：顺序执行、无条件执行、分支执行

2.断定方式

PPT章末习题

## 第五章 存储器

### 课件题目：

CPU与主存的连接（5.2以及5.2补充题）

Cache映射（5.3）

Cache替换（5.3.6）

多级Cache（5.3.7）

虚拟存储器页表（5.4.2）

TLB快表（5.4.3）

补充题（5.5末）

### 5.1 概述

#### 5.1.1 存储器

主存-内存（含rom（包括闪存）、ram）

辅存-外存（硬盘、光盘等）

作用：中心地位，向cpu提供数据指令，控制输入输出设备读写

<img src="../../blog-assets/2026-08-08-computer-organization-review-notes/image-039.png" alt="image 039" />

基本术语：

MAR-存储器地址寄存器

MDR-存储器数据寄存器

位元/记忆单元<存储单元/编制单位<存储体/矩阵/阵列

机器字长：CPU中寄存器的位数，数据通路的宽度

存储字：存储器的一个读写单位

编址方式：现代一般都按字节编址

传输单位：对辅存而言，传输单位为块

#### 5.1.2 存储器分类

按作用：寄存器/Cache(SRAM实现)/主存储器(DRAM)/辅助存储器/控存CM

按存储介质：半导体/磁表面/光盘

按存储方式：RAM（随机访问存储器）/ROM（只读存储器）/CAM（相联存储器）/DAS（直接存取存储器）磁盘/SAS

按可保存性：挥发性（易失性存储器）RAM ；永久性 ROM 磁盘 闪存

按读出后是否保持数据：破坏性存储器（读出原信息被破坏DRAM）非破坏性寄存器（SRAM：cache）

#### 5.1.3 评价指标

存储容量
存取时间/访问时间和存储周期（后者大于前者）

存取宽度和存储带宽（每秒传输的最大数据量）

可靠性 功耗与集成度 性价比

<img src="../../blog-assets/2026-08-08-computer-organization-review-notes/image-040.png" alt="image 040" />

#### 5.1.4 随机存取存储器RAM

两种原理：（都需供电）

1.触发器 SRAM：六管静态MOS管电路，无需刷新，不是破坏性读出。数据保存在一对正负反馈门电路中

2.电容 DRAM：单管动态MOS电路 需要刷新 破坏性读出 数据保存在电容中

<img src="../../blog-assets/2026-08-08-computer-organization-review-notes/image-041.png" alt="image 041" />

线选法（一维）存储矩阵 k位地址 2^k条地址选择线（2^k个地址，每个线选择一个地址）

片选法（二维） 2^k/2+2^k/2条地址选择线

地址引脚复用如下图（cpu传过来地址为14位 这是主存自己外围电路的设计不同）

<img src="../../blog-assets/2026-08-08-computer-organization-review-notes/image-042.png" alt="image 042" />

总结对比：

<img src="../../blog-assets/2026-08-08-computer-organization-review-notes/image-043.png" alt="image 043" />

5.1.5 ROM（只读存储器 只能被随机读不能随机写 非破坏性读出 非易失）

MROM（不能修改）PROM（修改一次） EPROM（多次修改）

### 5.2 主存储器

系统设计-逻辑设计-工艺设计

#### 5.2.1 逻辑设计

1.存储容量的扩展

位扩展全部copy，除了I/O

字扩展全部copy，除了片选信号

<img src="../../blog-assets/2026-08-08-computer-organization-review-notes/image-044.png" alt="image 044" />

<img src="../../blog-assets/2026-08-08-computer-organization-review-notes/image-045.png" alt="image 045" />

2.负载计算与分配

存储芯片的各端点就是负载，逻辑电路的负载能力有限，双极型芯片端点为电流负载；mos型芯片端点为电容负载

负载计算：看端点数

<img src="../../blog-assets/2026-08-08-computer-organization-review-notes/image-046.png" alt="image 046" />

<img src="../../blog-assets/2026-08-08-computer-organization-review-notes/image-047.png" alt="image 047" />

3.速度估算

外围电路传输引起延迟（估算预留余地 系统的要求存取时间和周期应当大于芯片的存取时间）

系统存储周期=芯片存储周期+系统传输延迟+系统恢复时间

#### 5.2.2 存储器与CPU的连接

1地址线的连接

CPU地址线数大于存储器地址引脚线

2数据线的连接

同上 决定了一次可读写的最大数据宽度（机器字长） 32位寄存器就有32个数据线 I/O

3控制线的连接

MREQ上面一根横线 为低电平访问主存

两种通信方式：

异步方式（要握手信号） 同步方式（同一时钟信号）

主存空间划分：ROM区用来放系统程序、标准子程序，RAM区用来放用户程序

#### 5.2.3 DRAM的刷新

信息保持时间：存入到仍能鉴别出原信息的时间

刷新周期：对同一存储位元连续两次刷新，仍能保证鉴别出原存信息的最大允许间隔时间，即在Trc内必须对每个单元刷新一遍

刷新操作周期：刷新一行（存储矩阵的一行 不是一个地址的一行）存储位元所需时间，通常和DRAM读写周期tRC/tWC相同

刷新操作周期数Nr： 存储芯片所有位元刷新一遍所需的刷新操作周期个数，与芯片结构有关（取决于存储矩阵行数）

刷新周期由许多的访存周期组成

集中刷新：刷新周期中调最后的若干访存周期进行集中刷新（批刷新）

分散式刷新：把刷新周期分成Nr份（即行数），每一份的最后一个访存周期用作刷新

透明式刷新：一个系统访存周期的前半段实际访存，后半段用来刷新。

<img src="../../blog-assets/2026-08-08-computer-organization-review-notes/image-048.png" alt="image 048" />

### 5.3 Cache(高速缓冲存储器)

<img src="../../blog-assets/2026-08-08-computer-organization-review-notes/image-049.png" alt="image 049" />

<img src="../../blog-assets/2026-08-08-computer-organization-review-notes/image-050.png" alt="image 050" />

#### 5.3.1 程序访问局部性

时间局部性（多次访问）

空间局部性（连续存放与访问顺序一致）

#### 5.3.2 Cache是怎么样的

有效位：TAG加有一位有效位

<img src="../../blog-assets/2026-08-08-computer-organization-review-notes/image-051.png" alt="image 051" />

<img src="../../blog-assets/2026-08-08-computer-organization-review-notes/image-052.png" alt="image 052" />

#### 5.3.3 Cathe和主存之间的映射

块：主存分为多个主存块

行（槽）：映射到cache中的某行

##### 主存地址统一结构：

Tag（主存块群号/Cathe比对用）+Cathe组号（一个组群的大小）+块内（行内）地址

对比方法：组号判断在哪一组 然后组内比对Tag

直接映射：命中时间短，命中率低

<img src="../../blog-assets/2026-08-08-computer-organization-review-notes/image-053.png" alt="image 053" />

全相联映射：命中时间长 命中率高

<img src="../../blog-assets/2026-08-08-computer-organization-review-notes/image-054.png" alt="image 054" />

### 组相联映射

<img src="../../blog-assets/2026-08-08-computer-organization-review-notes/image-055.png" alt="image 055" />

关联度：每个主存块对应的cache行的位置数（即每个Cathe组里面的行数）

提升关联度会提高命中率 但会增加命中时间

处理器性能越高（频率越高 CPI越小）Cache的影响就越大

#### 5.3.4 影响Cathe失效率的因素

1.Cathe大小：失效率越低，但成本高

2.block/行大小：越大失效率越低（但增加到一定的比例又会增加）

3.映射方式：Cathe容量小时，映射方式影响较大；反之

失效类型：

1.强制失效：第一次访问，必然引起的失效。

解决：增加block大小（这样访问数据在新的block的概率降低）

2.容量失效：Cathe满，访问内容被替换。

解决：增大cathe容量

3.冲突失效：同一组的数据满了（全相联不会有这种失效）

Cache抖动由容量失效和冲突失效导致（即某些block在主存和cathe间反复传送）

#### 5.3.5 Cathe一致性问题

写机制：

1.Write through（写直达，写通过，直写）

Cache和主存之间存在一个写缓冲buffet

同步更新

<img src="../../blog-assets/2026-08-08-computer-organization-review-notes/image-056.png" alt="image 056" />

2.Write back（写回、一次性写、回写）

不同步更新

每个Cache行设置一个脏位，初始为0，如果需要修改，则置1。只有1的块被替换时需要写回修改主存。

<img src="../../blog-assets/2026-08-08-computer-organization-review-notes/image-057.png" alt="image 057" />

若写操作未命中：

1.写分配：写主存后，再将主存块装入Cache

2.写不分配：只写主存

#### 5.3.6 Cache替换算法

组相联映射和全相联映射才需要替换算法

1.先进先出FIFO算法

2.最近最少用LRU （使用计数器，进入初始/更新为0，每次递增1，淘汰最大的）

3.随机替换

#### 5.3.7 多级Cathe

设计因素：

1.单级/多级（还有片内/片外）

2.联立/分立（数据和指令存放位置）分立命中时间短但命中率低 类似于直接映射

PS：L1 一般是分立（保证命中时间小） L2一般是联立（保证命中率高）

### 5.4 虚拟存储器

#### 5.4.1 基本概念

虚拟存储器的实质：

磁盘和主存之间的统一管理的存储管理缓存机制（而不是一种物理存储器）

虚拟存储器是对主存和硬盘I/O的抽象表示

文件是对I/O设备的抽象表示

进程是对处理器、主存和I/O设备的抽象表示

主存要运行更多进程，内存需求增大，解决措施：
1.扩大内存

2.交换机制（分区和分页）和覆盖技术

3.虚拟存储器：将内存外存同一管理的存储管理机制

按需调页，以固定页面调度

1.分区

a.简单分区：

<img src="../../blog-assets/2026-08-08-computer-organization-review-notes/image-058.png" alt="image 058" />

b.可变长分区：

<img src="../../blog-assets/2026-08-08-computer-organization-review-notes/image-059.png" alt="image 059" />

2.分页：

程序块/页:每个程序分成固定长的程序块

存储块/页框：内存/主存分成固定且较小的存储块

页表：操作系统生成，实现逻辑地址向物理地址的转换

<img src="../../blog-assets/2026-08-08-computer-organization-review-notes/image-060.png" alt="image 060" />

<img src="../../blog-assets/2026-08-08-computer-organization-review-notes/image-061.png" alt="image 061" />

分页时：所有程序共用整个编程空间

#### 5.4.2 虚拟存储器组织方式

虚拟存储器实现方式：页式 段式 段页式

页式（虚拟地址页和物理页的大小一致，对程序员透明）
页表：存放于主存,每个程序都有一个

页表项构成：装入位+访问权限+使用情况+修改位+磁盘地址/页框号

页表（项）本身占主存的空间

CPU访存时首先将逻辑（虚拟）地址通过页表转化为物理地址（在主存/磁盘）

<img src="../../blog-assets/2026-08-08-computer-organization-review-notes/image-062.png" alt="image 062" />

类似全相联映射，采用write back（设置脏位）

虚拟地址结构：虚页号+一页内部地址

异常情况：
1.缺页：产生条件有效位/装入位为0

处理：将信息从磁盘读到内存，替换算法类似cache，进程阻塞后继续执行

2.保护违例：当存取权限与操作不符合

处理：显示错误，阻塞进程终止

R = Read-only、R/W = read/write、X = execute only

#### 5.4.3 快表TLB

每次访存实际要访问两次存储器：一次访问页表 一次访问数据或指令

快表：一种cache，用来存储经常使用的页表项，可采用全相联，也可组相联

虚拟地址，先在TLB中找（比对虚页号），找不到再到页表中找

<img src="../../blog-assets/2026-08-08-computer-organization-review-notes/image-063.png" alt="image 063" />

<img src="../../blog-assets/2026-08-08-computer-organization-review-notes/image-064.png" alt="image 064" />

三种缺失（按访问顺序）：

1.TLB缺失（可能在页表中）

2.Cathe缺失（在主存中）

3.缺页（主存中都没 在外存）

<img src="../../blog-assets/2026-08-08-computer-organization-review-notes/image-065.png" alt="image 065" />

### 段式

<img src="../../blog-assets/2026-08-08-computer-organization-review-notes/image-066.png" alt="image 066" />

### 段页式

程序（虚拟空间）先分段，段内再进行分页

虚拟地址总结构：

段号+页号+页内偏移量

#### 5.4.4 存储保护

存储保护错误：

1.地址越界

2.访问越权

每道程序只能访问自己所在的存储区和共享区

保护措施：

1.两种模式：管理模式和用户模式

2.部分只能由系统进程写：User/Supervisor模式位、页表指针、TLB

3.异常或陷阱就切回管理态；异常处理中返回指令切回用户状态

程序重定位（即虚拟地址向物理地址的转换）进行地址越界判断：动态、静态

### 5.5 并行主存系统

#### 5.5.1 并行主存系统

多体存储器：共用MAR和MDR，控制电路等一致，但不能提高数据访问速度

双端口存储器：两套独立的控制电路，两个读写端口

多模块存储器（多体交叉）：多个小存储体，每个体都有自己的MAR、MDR和读写电路，可以提高速度访问速度

多模块存储器编址方式：

1.连续编址方式：主存地址码的高位区分体号，低位表示模块内地址

各个体并行工作，但容易方式访存冲突（一个存储体只能同时被一个地址进行访存）

2.交叉编址方式：主存地址吗的低位区分体号，高位表示模块内地址

各个体并行工作、轮流编址
