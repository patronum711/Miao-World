---
title: "并行程序设计复习笔记"
description: "整理并行程序设计课程的核心概念、性能模型、并行算法、OpenMP、MPI 与 GPU 编程相关复习内容。"
publishedAt: 2026-08-08
tags: ["学习笔记","并行程序设计","复习"]
---
# 第一章 并行计算的基本问题

## 1. 为什么需要并行计算

一句话：计算**需求**持续增长，但单个串行处理器的**性能**提升遇到物理和结构限制。

主要需求：

- 数据规模变大：科学观测、互联网、传感器等产生大量数据
- 模型规模变大：气候模型、大模型、物理模拟等需要更多计算预算
- 问题复杂度变高：蛋白质折叠、能源研究等难以用小规模计算解决

串行性能粗略公式：

\[
\text{Execution time}
= \frac{\text{Instructions}}{\text{Program}}
\times \frac{\text{Cycles}}{\text{Instruction}}
\times \frac{\text{Time}}{\text{Cycle}}
\]

等价地：

\[
\text{Performance} \propto \frac{\text{Clock Rate}}{\text{CPI}}
\]

过去提升性能的主要方式：

- 提高时钟频率
- 降低 CPI，例如流水线、更宽数据通路、乱序执行、超标量
- 利用指令级并行 ILP
- 增加晶体管密度

后来遇到的限制：

- **频率墙**：继续提高频率会显著增加功耗和发热
- **功耗墙 / 热墙**：Dennard scaling 结束后，晶体管更多不再意味着功耗密度不变
- **ILP 墙**：真实程序中能同时独立执行的指令有限，依赖关系限制了继续挖掘指令级并行
- **Moore 定律放缓**：晶体管密度长期翻倍的趋势不再稳定成立

所以路线变为：从提高单核速度，转向增加核心数和使用多种计算设备。

现代高性能系统通常不是单一处理器形态，而是多核 CPU、GPU、多个节点和互连网络的组合。

## 2. 为什么需要写并行程序

一句话：多核硬件不会自动让普通串行程序变快。

原因：

- 串行程序通常只使用一个执行流
- 多个核心需要被程序显式利用
- 运行多个串行程序实例通常不能让同一个任务变快
- 自动把任意串行程序翻译成高效并行程序很难
- 有些串行算法本身不适合并行，需要重新设计并行算法

**典型例子**：求很多数的和。

直接做法：每个核心先算局部和，然后都发给 master core，由 master 求全局和。

问题：master 需要接收和相加 p - 1 次，master 成为瓶颈。

更好的做法：使用树形归约。

- 第一轮：0 和 1 合并，2 和 3 合并，4 和 5 合并
- 第二轮：0 和 2 合并，4 和 6 合并
- 继续直到 core 0 得到最终结果

复杂度关系：

- master 集中求和：O(p)
- 树形归约：O(log p)

PS：这个例子说明，并行程序不是“把串行循环切开”这么简单。通信和汇总方式也会决定并行效率。

## 3. 并行的基本类型

### 3.1 数据并行

**定义**：把**数据划分给多个核心**，各核心对自己的数据执行**相同或相似操作**。

典型场景：

- 向量加法
- 矩阵运算
- 每个样本独立处理

特点：

- **任务结构规则**
- **负载通常比较容易均衡**
- 更适合 SIMD、GPU、OpenMP parallel for

### 3.2 任务并行

**定义**：把求解问题所需的不同**任务分配给不同核心**。

典型场景：

- 一个线程负责发送，另一个线程负责接收和加法
- 程序流水线中不同阶段由不同线程处理
- 树搜索中不同子树由不同线程处理

特点：

- **不同任务可能计算量不同**
- **负载均衡更复杂**
- **同步更复杂，更容易出现等待和调度问题**

## 4. 并行程序中的协调问题

主要协调关系：

- **通信**：一个核心把数据或中间结果交给另一个核心
- **负载均衡**：尽量让每个核心工作量接近，避免有的核心很早空闲
- **同步**：控制不同核心的执行进度，避免过早使用未完成的数据

## 5. 课程中的并行系统和框架

### 5.1 共享内存和分布式内存

并行程序的协调方式和底层内存系统关系很大。

**共享内存系统**：多个核心可以访问同一个内存地址空间，核心之间主要通过**读写共享变量**来协调。

**分布式内存系统**：每个核心或节点有自己的私有内存，其他核心不能直接访问，只能通过**显式消息传递**来交换数据。

### 5.2 本课程涉及的并行框架

本课程主要学习显式并行程序设计，语言基础是 C/C++。

对应关系：

- **MPI**：面向分布式内存系统，通过消息传递协调进程
- **Pthreads**：面向共享内存系统，显式创建和同步线程
- **OpenMP**：面向共享内存系统，用编译指示较高层地并行化循环和任务
- **CUDA**：面向 CPU-GPU 异构系统，用大量 GPU 线程进行数据并行计算

## 6. 并发、并行、分布式

### 6.1 并发

**定义**：多个任务在同一时间段内进行+举例

并发不要求物理上同时执行。单核处理器通过时间片切换也可以支持并发。

### 6.2 并行

**定义**：多个任务在同一物理时刻执行，并且**通常紧密合作求解同一个问题**+举例

并行要求硬件上有多个执行资源。

### 6.3 分布式

**定义**：多个程序或节点运行在不同地址空间或不同机器上，通过**通信协作**完成任务。

# 第二章 并行硬件和软件基础

## 1. 冯诺依曼结构与瓶颈

**定义**：冯诺依曼结构中，指令和数据都存放在内存中，处理器通过**总线读写主存**

基本部件：

- 处理器：控制单元+算术逻辑单元
- 寄存器：CPU 内部很快的存储
- 程序计数器：保存下一条指令地址
- 主存：保存指令和数据
- 总线：连接 CPU 和内存，传递地址、数据和控制信号

**冯诺依曼瓶颈：**

处理器速度和内存访问速度不匹配，处理器经常等待数据从内存到来。

## 2. 进程、线程和多任务

### 2.1 进程

**定义**：进程是正在执行的程序实例。

进程通常包含：

- 可执行机器**代码**
- 独立**地址空间**
- 操作系统分配的**资源描述符**
- 安全信息
- 执行状态信息

### 2.2 线程

**定义**：线程是进程内部的**执行流**，可以看作轻量级进程。

线程的特点：

- 同一进程内多个**线程共享地址空间**
- 线程有自己的**执行上下文**，例如寄存器、程序计数器、栈
- 一个进程可以让**多个线程在不同核心上运行**

### 2.3 多任务

**定义**：多任务通过时间片切换，让单处理器系统看起来像同时运行多个程序。

## 3. 缓存

### 3.1 缓存

**定义**：缓存是比**主存访问更快、容量更小**的存储层次，用来保存主存中最近或即将使用的**数据副本**。

关键概念：

- **缓存行**：缓存和主存之间传输的固定**大小数据块**，常见大小是 64B
- **cache hit**：要访问的数据已经在缓存中
- **cache miss**：要访问的数据不在缓存中，需要访问更低层存储
- **eviction**：缓存容量有限，旧缓存行被替换出去

### 3.2 局部性

**时间局部性**：刚访问过的数据，短时间内可能再次被访问。

**空间局部性**：访问某个地址后，附近地址可能很快被访问。

例子：顺序遍历数组具有良好空间局部性。

### 3.3 一致性写策略

写缓存后，缓存和主存可能暂时不一致。

常见策略：

- **write-through**：写缓存时同时写主存
- **write-back**：只修改缓存并标记 **dirty**，缓存行被替换时再写回主存

写Miss处理策略：

- **write-allocate**：写缺失时先把整条缓存行载入缓存，再在缓存中写
- **write-around**：写缺失时绕过缓存，直接写到下一层存储

### 3.4 映射方式

缓存行放入缓存的位置有不同规则（n代表cache set里面line个数）：

- **全相联**：任意主存行可以放在缓存任意位置
- **直接映射**：每个主存行只能放在唯一缓存位置
- **n 路组相联**：每个主存行可以放在某个组中的 n 个位置之一

替换策略常用最近最少使用 LRU 思想。

## 4. 虚拟内存

**定义**：虚拟内存让**每个进程认为自己拥有一个大而连续的私有地址空间**，操作系统和硬件负责把**虚拟地址映射到物理内存或磁盘**。

虚拟地址=虚拟页号+偏移地址

作用：

- 实现**进程隔离**和保护（每个进程有自己的页表）
- 只把**活跃页面放在主存中**
- 简化**内存管理**

关键概念：

- **页**：虚拟内存和物理内存**交换的块**，常见大小为 4KB 到 16KB
- **页表**：记录**虚拟页号到物理页框号的映射**（在主存中）
- **TLB**：地址转换缓存（在CPU缓存中）
- **缺页**：访问的有效页面当前只在磁盘上，需要调入主存

**总思维图：**

地址翻译线：
虚拟地址 -> TLB -> 页表（在主存中） -> 磁盘/硬盘（缺页时）
最终查询得到物理地址，并且保证所需要的页面一定在主存中了

数据访问线：
物理地址 -> Cache(L1/L2/L3) -> 主存 -> 磁盘/硬盘

## 5. 指令级并行 ILP(Instruction Level Parrallel)

**定义**：指令级并行是在**单个指令流内部，利用硬件同时执行多条可独立执行的指令**。

常见机制：

- **流水线**：把指令执行**拆成多个阶段**，不同指令可处于不同阶段
- **多发射**：一个周期内启动多条互不依赖的指令
  - **静态多发射**：编译期决定哪些指令同时发射
  - **动态多发射 / 超标量**：运行时由硬件决定

- **推测执行**：编译器或处理器猜测分支结果并提前执行，猜错则回滚

## 6. 硬件多线程

**定义**：硬件多线程让一个**物理核心core可以保存多个线程的体系结构状态**，并在**硬件层面切换或同时使用执行单元**。

目的：当当前线程因为内存访问等长延迟操作停顿时，核心可以执行其他线程的指令。

类型：

- **细粒度多线程**：几乎每条**指令后都可能切换线程**
- **粗粒度多线程**：只有**当前线程遇到长延迟停顿时才切换**
- **同时多线程 SMT**：多个线程可以**同时**使用核心中的不同功能单元

## 7. CPU、core、processor 的关系

**processor**：泛称处理器，有时和 CPU 混用，也可以指多处理器系统中的一个处理单元。

**core**：通常是 CPU 内部的基本计算单元。

**CPU**：一个芯片或处理器封装，可能包含一个或多个 core。

关系：

- 一个系统可以有一个或多个 CPU
- 一个 CPU 可以有一个或多个 core
- 一个 core 可以执行一个或多个**硬件线程，取决于是否支持超线程等技术**

# 第三章 并行系统分类和互连

## 1. Flynn 弗林分类法（想图）

Flynn 分类法根据**指令流**和**数据流数量**划分计算机体系结构。

相关概念：

- **指令流**：机器执行的**指令序列**
- **数据流**：指令流调用的**数据序列**，包括输入数据和中间结果，不包括输出数据
- **多倍性**：系统瓶颈部件上处于同一执行阶段的指令或数据最大可能个数

分类表：

| 类型 | 指令流 | 数据流 | 典型例子 |
|---|---|---|---|
| SISD | 单 | 单 | 传统串行冯诺依曼计算机 |
| SIMD | 单 | 多 | 向量计算机、阵列计算机 |
| MISD | 多 | 单 | 很少使用，分类本身有争议 |
| MIMD | 多 | 多 | 多处理器、多计算机、集群、超算 |

## 2. SIMD、向量处理器和 SIMT

### 2.1 SIMD

**定义**：SIMD 使用一条指令流，同时对多个数据流执行相同操作。

分为：**阵列处理器和向量处理器**

适合：

- 向量和矩阵计算
- 图像处理
- 数字信号处理
- 大规模规则数据并行

如果数据项多于 ALU 数量，就分批处理。

### 2.2 向量处理器

**定义**：向量处理器以**向量为基本操作对象**，对向量中的**多个元素执行相同操作**。

主要部件：

- 向量寄存器：存储向量
- 向量化、流水化功能部件
- 向量指令
- 交叉/错存储器：内存系统由多个内存体组成，每个都能独立访问
- 跨步/步长访问：能够访问向量中固定间隔的元素
- 硬件散射/聚集：能够对无固定间隔的数据进行读和写

优点：

- 速度快
- 编译器容易识别可向量化循环
- 内存带宽高
- 能充分利用缓存行中的元素

缺点：

- 对不规则数据结构支持弱
- 扩展性受向量长度和定制硬件限制
- 支持长向量的硬件成本高

## 3. MIMD 的内存组织分类

MIMD 可以按处理器访问内存方式继续分类。

### 3.1 共享内存系统

**定义**：**多个处理器共享一个全局地址空间，通过读写共享内存通信。**

共享内存系统分为：

- **集中共享内存 CSM / SMP / UMA**
- **分布式共享内存 DSM / NUMA**

#### 3.1.1 UMA 集中式共享内存/一致性共享内存

**定义**：UMA 中**所有处理器访问共享内存的延迟相同**。

特点：

- 有一个被所有处理器**均匀共享**的存储器
- 处理器访问内存**延迟相同**
- 每个处理器可以有**私有缓存**
- **处理器数通常较少**

#### 3.1.2 NUMA 分布式共享内存/非一致性共享内存

**定义**：NUMA 中所有处理器看到仍然单一地址空间，但访问本地内存和远程内存延迟不同。

特点：

- 所有的处理器都能访问一个单一的地址空间
- 可以通过 load/store 访问远程内存
- 远程访问比本地访问更慢
- 可以带缓存，形成 ccNUMA

### 3.2 分布式内存系统

**定义**：**每个节点有自己的私有内存，其他节点不能直接访问，只能通过消息传递通信。**

类型：

- **MPP**：大规模并行处理器系统。常使用定制高速网络，面向科学计算和工程模拟（共享硬盘）
- **COW / WSC**：工作站机群系统。或仓库级计算机，由大量独立机器通过商用网络组织，常见于数据中心（独立硬盘，完全独立）

## 4. 互连网络

**定义**：互连网络是在并行计算机中**传输数据**、**连接处理器、内存、缓存和节点**的系统。

它的作用不是“额外的网络知识”，而是把并行机器内部的计算部件连成一个能通信的整体。

互连网络影响两类系统：

- 共享内存系统中处理器到内存的访问
- 分布式内存系统中节点间消息传递
- GPU 或多核芯片内部核心、缓存和内存分区之间的数据移动

按覆盖范围看，互连网络可以分为：

- **广域网 WAN**：跨地区、全球范围连接
- **局域网 LAN**：机房、楼宇、校园范围连接
- **系统区域网络 System-Area Network**：一台并行机或超级计算机内部连接
- **片上网络 On-Chip Network**：一个芯片内部核心、缓存、目录等部件之间连接

PS：这门课关心的主要是 **System-Area Network** 和 **On-Chip Network**，不是普通计算机网络里的 TCP/IP 细节。

### 4.1 节点、链路、通道

节点可以包含：

- 一个或多个处理器
- 通信控制器
- 路由器

链路和通道：

- **链路 link**：连接两个节点的一组通信线，可以是单向或双向
- **通道 channel**：链路加上发送端和接收端
- 消息通常会被拆成 packet，packet 由 header、payload、trailer 组成

PS：考试里一般不要求深入 packet 格式。这里更重要的是知道互连网络不是一个抽象名词，它由节点、路由器、链路组成。

### 4.2 网络拓扑和评价指标

**定义**：网络拓扑是网络的形状，决定消息从一个节点到另一个节点要经过多少条链路，也就是多少跳。

基本指标：

- **延迟 latency**：源开始发送到目的开始接收第一个字节的时间
- **带宽 bandwidth**：目的开始接收后，数据到达速率
- **直径 diameter**：任意两个节点之间最远距离
- **平均距离**：所有节点对距离的平均值
- **度 degree**：一个交换机或节点连接的链路数量
- **等分宽度 bisection width**：把网络分成两半时，跨越两半的链路数
- **等分带宽 bisection bandwidth**：跨越两半的链路带宽总和

消息传输时间：

\[
T = l + \frac{n}{b}
\]

其中 l 是延迟，n 是消息长度，b 是带宽。

PS：小消息更受 latency 影响；大消息更受 bandwidth 影响。

PS：**等分宽度**数的是链路条数；**等分带宽**数的是这些链路能提供的总带宽。前者偏拓扑连通性，后者偏实际通信能力。

### 4.3 按系统类型分类

互连网络在 PPT 中主要按使用场景分成两类：

- **共享内存互连**
- **分布式内存互连**

这个分类的依据不是拓扑形状，而是它连接的是“处理器和共享内存”，还是“多个带私有内存的节点”。

#### 4.3.1 共享内存互连

总线互连：

- 多个设备共享一组通信线
- 成本低、结构简单
- 设备越多，争用越严重，可扩展性差

交换互连：

- 通过交换器路由数据
- crossbar 可支持多个设备同时通信
- 比总线快，但交换器和链路成本高

crossbar 的直观理解：

- 有多个处理器和多个内存模块
- 交叉开关负责把某个处理器连到某个内存模块
- 只要访问目标不冲突，就可以同时发生多组通信

PS：bus 的问题是“大家抢一条路”；crossbar 的优势是“可以同时开多条路”，但硬件成本更高。

#### 4.3.2 分布式内存互连

分布式内存互连分为直接互连和间接互连。

直接互连：

- 每个交换器直接连接一个处理器-内存对
- 交换器之间互相连接
- 节点既是计算节点，也是网络中的转发节点
- 例子：ring、toroidal mesh、fully connected network、hypercube

常见直接互连：

- **ring**：节点连成环。结构简单，但最远距离可能较大
- **toroidal mesh**：二维网格首尾相连，边界也连起来，比普通 mesh 更均匀
- **fully connected network**：每个交换器直接连接到所有其他交换器，连通性强，但链路成本高
- **hypercube**：高连接度直接互连，通过低维超立方体递归构造高维超立方体

间接互连：

- 交换器不一定直接连接处理器
- 节点通过中间交换网络通信
- 例子：crossbar、omega network

PS：直接互连强调节点之间也直接构成拓扑；间接互连强调中间有一层或多层交换网络。crossbar 在共享内存和分布式内存里都可能出现，区别在于它连接的对象不同。

## 5. Cache coherence

### 5.1 缓存一致性问题

**定义**：**当多个处理器缓存同一个变量时，一个处理器更新了该变量，系统需要保证其他处理器不会继续使用旧副本。**

问题来源：

- 缓存由硬件管理
- 程序员不能直接控制缓存行副本
- 多个核心可能把同一个内存位置的副本放在各自私有缓存中
- 一个核心写入后，其他核心缓存中的副本可能变成旧值

### 5.2 缓存一致性协议的基本思路

**定义**：缓存一致性协议规定**读、写、失效、更新如何协调**，使一个核心修改数据后，其他核心不会继续使用 stale copy。

特点：

- 通常按**缓存行**工作
- 每个**私有缓存对每个缓存块维护状态**
- 状态描述这个缓存块在**本地是否有效、是否可能被其他缓存共享、主存是否是最新值**
- 状态可能包括 **Invalid、Shared、Modified、Owned、Forward** 等

状态转换由两类事件触发：

- **本地处理器动作**：read hit、read miss、write hit、write miss、eviction
- **远程一致性动作**：其他核心请求共享副本、请求独占写权限、发送 invalidation

PS：协议维护的单位是**缓存行**。这一点直接引出伪共享。

### 5.3 两类常见实现

#### 5.3.1 Snooping cache coherence

**定义**：snooping 是让各个**缓存监听**共享总线或互连上的一致性请求，发现和自己缓存行有关的读写请求时更新状态。

直观理解：

- 某个核心要写一个共享缓存行时，会广播请求
- 其他缓存发现自己也有这行，就把副本置为无效，或者按协议更新状态

适合：

- 有共享总线或可广播互连的小规模共享内存系统

限制：

- 核心数变多后，**广播和监听开销增大**
- 可扩展性较差

#### 5.3.2 Directory-based cache coherence

**定义**：directory-based 方法用目录记录每条缓存行被哪些核心缓存，以及处于什么状态。

目录中可能记录：

- 当前缓存行是否未缓存、共享、独占或修改
- 哪些核心持有该缓存行副本
- 当某个核心要写时，需要通知哪些核心失效

特点：

- 优点：更新时**只联系真正缓存该行的核心**
- 缺点：需要**额外目录存储**
- 目录可以分布式维护，适合更**大规模系统**

PS：snooping 像“大家都听广播”；directory-based 像“先查登记表，只通知相关的人”。

### 5.4 伪共享

**定义**：1.多个线程访问的是不同变量，2.但这些变量落在同一缓存行中，3.导致缓存一致性协议把它们当作共享同一行处理，引发频繁失效。

条件：

- 不同线程写不同变量
- 这些变量位于同一缓存行
- 缓存一致性按缓存行而不是按单个变量维护

例子：

假设 cache line 大小是 64B，一个 double 是 8B，那么一个缓存行可以放 8 个 double。

如果数组 y 的 y[0] 到 y[7] 正好在同一个缓存行中：

- thread 0 反复写 y[0]
- thread 1 反复写 y[1]
- thread 2 反复写 y[2]
- thread 3 反复写 y[3]

从程序逻辑看，线程写的是不同数组元素，没有真正共享同一个变量。

但从硬件看，它们写的是同一个缓存行。一个核心写 y[0]，会使其他核心缓存中的整条 y[0] 到 y[7] 所在缓存行失效。其他核心再写自己的 y[i] 时，又要重新获得该缓存行，导致缓存行在核心之间来回“抖动”。

后果：

- 程序逻辑上没有真正共享
- 硬件上却不断使对方缓存行失效
- 多线程效率显著下降
- 失效后再次写入同一行时，容易产生大量 write miss

避免思路：

- 让不同线程频繁写的数据**分布到不同缓存行**
- 使用 padding 或对齐，把相邻线程的写入位置隔开
- 尽量让线程先写自己的局部变量，最后再合并
- 数据划分时避免多个核心频繁写同一缓存行中的不同元素

# 第四章 MPI：分布式内存编程

易错：

1. count 表示本进程发送/接收的 datatype 元素个数；Scatter/Gather 中通常是“每个进程的一份数量”，不是总量。

## 1. MPI 定义

**定义**：MPI 是**消息传递接口**，是用于**分布式内存并行编程**的**函数库标准**。

MPI 程序的基本前提：

- 多个进程运行
- 每个进程有独立地址空间
- 进程之间通过**消息通信**
- 进程通常用 **rank 标识**

## 2. MPI 程序模型

### 2.1 rank 和 communicator

**rank**：进程在通信域中的编号，p 个进程通常编号为 0, 1, 2, ..., p - 1，常用 rank 判断当前进程该做什么

**communicator/通信域**：communicator 是一组可以互相发送消息的**进程集合**。

**常用函数：**

- MPI_Init：初始化 MPI 环境，创建默认通信域 MPI_COMM_WORLD，它包含程序启动时创建的所有进程。
- MPI_Finalize：结束 MPI 环境
- MPI_Comm_size：得到通信域中的进程总数
- MPI_Comm_rank：得到当前进程在通信域中的 rank

**编译与运行：**mpicc mpiexec -n p

### 2.2 SPMD

**定义**：SPMD 是 Single Program Multiple Data，即**所有进程运行同一个程序，但根据 rank 处理不同数据或执行不同分支**。

典型写法：

- rank 0 负责输入、输出或汇总
- 其他 rank 负责计算

## 3. 点对点通信

**定义**：点对点通信是**两个进程之间**的消息发送和接收。

基本函数：

- MPI_Send：发送消息
- MPI_Recv：接收消息

参数：

- 发送缓冲区、发送数量、发送数据类型
- 目标进程 dest
- 接收缓冲区、接收数量、接收数据类型
- 源进程 source
- tag用于进一步区分语义
- communicator

消息匹配通常依赖：

- source
- destination
- tag
- communicator

### 3.1 接收消息时的信息

接收方可以使用更宽松的匹配：

- 不知道 source 时，可以使用 MPI_ANY_SOURCE
- 不知道 tag 时，可以使用 MPI_ANY_TAG

接收后通过 MPI_Status 查看实际 source 和 tag

MPI_Status 中常用信息：

- MPI_SOURCE：实际发送者
- MPI_TAG：实际 tag
- MPI_ERROR：错误信息

如果不知道实际接收了多少数据，可以通过 MPI_Get_count 从 status 中查询。

## 4. 集合通信

**定义**：集合通信是**通信域中所有进程共同调用**的通信操作。

匹配：

- 集合通信按 **communicator 和调用顺序**匹配
- communicator 中所有进程必须调用同一个集合通信函数

### 4.1 MPI_Reduce 和 MPI_Allreduce

**定义**：MPI_Reduce 把各进程的数据按某个归约运算合并，并把结果放到目标进程。

参数：

1. 发送缓冲区 接受缓存区 数量 类型
2. 规约运算
3. 接受者
4. communicator

常见归约运算：

- MPI_SUM
- MPI_PROD
- MPI_MAX
- MPI_MIN

**定义**：MPI_Allreduce 把所有进程的数据归约后，将结果**分发给所有进程。**

Reduce 和 Allreduce 的区别：

- Reduce：结果只到 root
- Allreduce：结果到所有进程

### 4.2 MPI_Bcast

**定义**：MPI_Bcast 把某个 root 进程中的数据广播给通信域内所有进程。

参数：

1. 接受/发送缓冲区 数量 类型
2. 发送者
3. communicator

常用于：

- rank 0 读取输入
- 把输入公共参数发送给所有进程

### 4.3 Scatter、Gather、Allgather

MPI_Scatter：

参数：

1. 输入缓冲区 数量 类型
2. 输出缓冲区 数量 类型
3. 发送者
4. communicator

- root 持有完整数组
- 把不同片段分发给各进程

MPI_Gather：

参数：

1. 输入缓冲区 数量 类型
2. 输出缓冲区 数量 类型
3. 接受者
4. communicator

- 各进程持有局部数据
- 收集到 root

MPI_Allgather：

1. 输入缓冲区 数量 类型
2. 输出缓冲区 数量 类型
3. communicator

- 各进程的局部数据被拼接
- 拼接结果发给所有进程

## 5. 数据分布和典型例子

常见数据划分方式：

- **块划分 block partitioning**：连续数据分给同一进程
- **循环划分 cyclic partitioning**：按轮转方式分配元素
- **块循环划分 block-cyclic partitioning**：以数据块为单位轮转分配

选择**依据**：

- 如果每个元素计算量相近，block 简单且局部性好
- 如果不同元素计算量差异明显，cyclic 更容易负载均衡
- block-cyclic 在局部性和负载均衡之间折中

### 5.1 思想：梯形积分

梯形积分：划分、局部计算、汇总。

过程：

- rank 0 读取积分区间、梯形数量等输入
- 所有进程得到输入参数，常用 Bcast
- 每个进程负责一段子区间
- 每个进程计算 local integral
- 用 Reduce 把局部结果加到 root

### 5.2 向量加法

常见方式：

- rank 0 读取完整向量
- 用 Scatter 把向量片段发给各进程
- 每个进程计算自己的局部片段
- 用 Gather 把结果收集回 root

### 5.3 矩阵向量乘法

矩阵向量乘法中，通常把**矩阵A按行**分给各进程，x为公共参数需要所有进程获得。

原因：

- y 的第 i 个元素等于 A 的第 i 行和 x 的点积
- 每一行对应一个输出元素
- 按行划分时，每个进程可以独立计算一段 y

常见通信：

- A 的若干行分给各进程
- x 通常需要让每个进程都知道，可以用 Bcast 或 Allgather
- 各进程计算 local y
- 如果 root 需要完整 y，则 Gather

### 5.4 奇偶换位排序

每个进程拥有local keys，先执行偶换位、再执行奇换位，执行多轮后有序

MPI 版本：

- 每个进程持有 n/p 个 key
- 每一阶段只和相邻进程通信
- 通信后保留较小半或较大半，使低 rank 的 key 不大于高 rank 的 key

安全，交换防死锁：

1. 规定一边先发，一边先收。
2. 用MPI_Sendrecv防死锁

## 6. MPI 派生数据类型

**定义**：用来描述一组数据项的**类型**和相对位置，使 MPI 能把不连续的数据当作一个通信对象。

用途举例：发送结构体，发送矩阵列、子矩阵等非连续数据

常用步骤（创建create+commit+free）：

- MPI_Type_create_struct 创建结构化派生类型
- MPI_Get_address 获取成员地址
- MPI_Type_commit 提交给 MPI 优化内部表示
- MPI_Type_free 使用完后释放派生类型

## 7. MPI 程序性能评估

**指标1：**elapsed time/wall clock time（现实时间流逝）

常用工具：

- MPI_Wtime：返回某个过去时刻以来的秒数

- MPI_Barrier：让通信域中所有进程都到达屏障后再继续

计时注意：

- 并行程序总时间由最慢进程决定
- 计时前可用 MPI_Barrier 对齐开始时间

```
MPI_Barrier(MPI_COMM_WORLD);
double start = MPI_Wtime();

/* 要测的并行代码 */

double local_elapsed = MPI_Wtime() - start;

MPI_Reduce(&local_elapsed, &elapsed, 1, MPI_DOUBLE,
           MPI_MAX, 0, MPI_COMM_WORLD);   // 取最大值给Root
```

**指标2:**加速比S、效率E
\[
S = \frac{T_{serial}}{T_{parallel}}
\]

\[
E = \frac{S}{p}
\]

**指标3：** 可拓展性：如果增加进程数 p 时，可以通过增加问题规模 n 使效率不下降，则程序具有**可扩展性**

- **强可扩展 strong scalability**：问题规模不变，增加进程数后效率仍能保持
- **弱可扩展 weak scalability**：问题规模随进程数增加，效率仍能保持

加速比不是越接近 p 越理所当然。通信开销、负载不均衡、串行部分都会降低效率。

## 8. MPI 程序的安全性

MPI 标准允许 MPI_Send 有两种行为：

- 把消息复制到 MPI 内部缓冲区后返回（小消息）
- 阻塞到匹配的 MPI_Recv 开始（大消息）

**定义**：如果程序正确性依赖 MPI_Send 对消息进行缓冲，则该程序是不安全的。

典型死锁：

- 每个进程先执行阻塞发送Send
- 所有发送都等待对应接收开始Recv
- 没有进程能执行到接收
- 程序挂起

解决方式：

- 规定通信顺序，例如奇偶进程先后不同
- 使用 MPI_Ssend 暴露潜在死锁
- 使用 MPI_Sendrecv，让 MPI 同时调度发送和接收
- 合理的集合通信

## 9. MPI 期末 API 汇总

| API | 作用 | 易错点 |
|---|---|---|
| MPI_Init | 初始化 MPI 环境 | MPI 调用通常应位于 Init 之后 |
| MPI_Finalize | 结束 MPI 环境并释放资源 | Finalize 之后不应继续调用 MPI 通信函数 |
| MPI_Comm_**s**ize | 得到通信域中的进程总数 | 返回的是 communicator 内部进程数 |
| MPI_Comm_rank | 得到当前进程在通信域中的 rank | rank 范围是 0 到 p - 1 |
| MPI_Send | 点对点发送消息 | 是否阻塞到接收开始由实现和消息大小决定 |
| MPI_Recv | 点对点接收消息 | 会阻塞直到匹配消息到达 |
| MPI_Ssend | 同步发送 | 可用于暴露依赖缓冲的死锁 |
| MPI_Sendrecv | 同时执行一次发送和一次接收 | 适合邻居交换，MPI 会调度避免挂起 |
| MPI_Reduce | 所有进程参与归约，结果到 root | 集合通信不用 tag，按调用顺序匹配 |
| MPI_Allreduce | 所有进程参与归约，所有进程得到结果 | 适合后续每个进程都要用全局结果 |
| MPI_Bcast | root 把数据广播给所有进程 | 所有进程都必须调用 |
| MPI_Scatter | root 把数组切分发给各进程 | 默认每个进程接收数量相同 |
| MPI_Gather | 各进程把局部数据收集到 root | 默认每个进程发送数量相同 |
| MPI_Allgather | Gather 后结果给所有进程 | 没有单独的目标进程 |
| MPI_Barrier | 屏障同步 | 常用于计时前对齐，不负责传数据 |
| MPI_Wtime | 返回 wall clock time | 计时应关注最慢进程的完成时间 |
| MPI_Get_count | 根据 status 得到实际接收数量 | 接收使用任意长度或来源时有用 |
| MPI_Get_address | 得到内存地址 | 常配合派生数据类型使用 |
| MPI_Type_create_struct | 创建结构化派生类型 | 创建后还需要 commit |
| MPI_Type_commit | 提交派生类型 | commit 后才能用于通信 |
| MPI_Type_free | 释放派生类型 | 避免派生类型占用额外资源 |

# 第五章 Pthreads：底层共享内存编程

## 1. Pthreads 定义

**定义**：Pthreads 是 POSIX Threads，是 Unix-like 系统上的多线程 API 标准，对应的是**共享内存编程**。

## 2. Pthreads 程序模型

**pthread_t**: 唯一标识线程，pthread_t 是不透明对象，不要直接访问其内部成员

**基本生命周期**：

- pthread_create 创建线程
- 线程函数开始执行
- pthread_join 等待线程结束

**pthread_create** 的核心参数：

- thread_p：输出参数，保存新线程对应的 pthread_t（线程的唯一标识）对象的指针
- attr_p：线程属性；课程中通常传 NULL
- start_routine：线程要执行的函数
- arg_p：传给线程函数的参数

线程函数原型：

```c
void* thread_function(void* args_p);
```

含义：

- 参数用 void*，所以可以传一个整数编号，也可以传一个结构体指针
- 返回值也是 void*，必要时可以返回结果指针

**pthread_join**：

- 对每个 joinable 线程调用一次
- 主线程会等待对应线程结束
- 同时回收线程资源

## 3. 共享变量、竞争条件和临界区

### 3.1 共享变量和私有变量

- **全局变量**：同一进程内所有线程共享，适合保存确实需要共享的状态
- **局部变量**：通常属于执行该函数的线程私有
- **静态局部变量**：虽然写在函数内部，但存储持续存在，可能被多个线程共享

### 3.2 竞争条件

**定义**：**多个线程访问共享资源**，且**至少一个线程写入**，最终**结果依赖执行交错顺序**，就可能产生竞争条件。

常见场景：

- 多个线程更新全局 sum
- 多个线程修改链表、队列等共享数据结构
- 多个线程调用带内部静态状态的库函数

### 3.3 临界区

**定义**：**临界区是访问或修改共享资源、同一时刻只能由一个线程执行的代码块**。

临界区本质上会串行化一部分程序。

全局求和的常见写法：

- 每个线程先在私有局部变量中累加 local_sum
- 最后进入临界区，把 local_sum 加到共享 global_sum
- 不要每次循环迭代都加锁更新 global_sum，否则锁开销很大

## 4. 忙等待

**定义**：忙等待是线程不断检查某个条件，直到条件满足，在等待期间线程几乎不做有用工作。

**问题**：浪费 CPU 周期，线程数多于核心数时可能严重拖慢程序，编译器优化可能破坏简单 flag 等待逻辑

忙等待和 mutex 的**区别**：

- 忙等待可以**强行安排线程访问临界区的顺序**，但浪费 CPU
- mutex 保证互斥，但**进入临界区的顺序由调度器决定**

## 5. Mutex/互斥锁

**定义**：mutex 是**互斥锁**，用于保证**同一时刻只有一个线程进入某个临界区**。

变量：pthread_mutex_t

**典型 API：**

- pthread_mutex_init
- pthread_mutex_lock
- pthread_mutex_unlock
- pthread_mutex_destroy

**限制：**

- 只能表达互斥，不直接表达“某个条件满足后再继续”，即不能保证顺序
- 如果使用过多或粒度过粗，会串行化程序

## 6. Semaphore

**定义**：信号量是一个**非负计数值**，用于**控制资源数量或线程执行顺序**。

基本操作：

- sem_init：初始化信号量。pshared 为 0 表示在同一进程的多个线程之间共享
- sem_wait // 等待：若值大于 0，则减 1 并解除阻塞；若值为 0，则阻塞
- sem_post // 唤醒：值加 1；如果有线程阻塞在该信号量上，唤醒其中一个

与 mutex 的区别：

- 共享资源数量：mutex 通常只允许一个线程进入临界区，semaphore 可以允许多个线程同时通过，数量由初值决定
- 通知机制：semaphore 还能用于**线程间通知和顺序控制**

## 7. Barrier





- 
- semaphore
- condition variable

用途：

- 计时：让所有线程同时开始或结束某段计算
- 调试：确认所有线程到达同一阶段

## 8. Condition variable

**定义**：条件变量总是和 mutex 关联。条件变量允许线程在某个条件未满足时阻塞，并在其他线程发出信号后被唤醒。

类型：pthread_cond_t

**典型 API：**

- pthread_cond_wait
- pthread_cond_signal
- pthread_cond_broadcast

pthread_cond_wait 的逻辑：

- 调用前，线程已经持有关联 mutex
- 调用时，线程进入等待前会释放 mutex
- 被唤醒后，线程重新获得 mutex，再继续while检查条件

## 9. Read-write lock

**定义**：读写锁允许多个线程同时读，但写线程必须独占访问。

规则：

- 多个读线程可以同时持有读锁
- 有线程持有写锁时，其他读写线程都阻塞
- 有线程持有读锁时，写线程阻塞

适用场景：

- 大多数操作是查询，不会破坏数据结构
- 少数操作是插入、删除或修改

锁粒度：

- 一个 mutex 保护整条链表：简单，但并行性差
- 每个节点一个 mutex：粒度细，但代码复杂、锁开销大、空间开销大

## 10. 线程安全

**定义**：**一段代码如果可以被多个线程同时执行而不产生错误，则称为线程安全**。

非线程安全例子：

strtok 使用静态内部状态保存上一次扫描位置，多线程同时调用时，不同线程会覆盖彼此的扫描状态

线程安全替代：

strtok_r 把扫描状态保存在调用者提供的 saveptr 中

## 11. Pthreads 和缓存问题

共享内存程序性能受缓存影响很大。

典型问题：

- write miss：核心写一个不在缓存中的变量，需要访问主存或更低层缓存
- cache coherence：多个核心缓存同一行时，写入会触发一致性维护
- false sharing：不同线程写不同变量，但变量在同一缓存行中，导致一个线程写入一个缓存行，其他线程的缓存失效。

PPT 中的矩阵向量乘法提醒：

- 8M × 8 和 8 × 8M 这种形状虽然总元素量相近，但缓存行为不同。8M × 8 可能对输出 y 产生大量 write miss，8 × 8M 可能对输入 x 产生大量 read miss，多线程时，都会导致频繁写落在同一 cache line 的不同 y 元素，可能发生 false sharing。

## 12. Pthreads 期末 API 汇总

| API / 机制 | 作用 | 易错点 |
|---|---|---|
| pthread_create | 创建新线程，并从指定函数开始执行 | 参数传递常用 void*，要注意类型转换和生命周期 |
| pthread_join | 等待指定 joinable 线程结束并回收资源 | 不 join 也不 detach 会留下线程资源 |
| pthread_detach | 让线程结束后自动回收资源 | detach 后不能再 join |
| pthread_mutex_init | 初始化 mutex | 使用前要初始化 |
| pthread_mutex_lock | 获取互斥锁，进入临界区 | 忘记 unlock 会导致其他线程永久等待 |
| pthread_mutex_unlock | 释放互斥锁，离开临界区 | 临界区要尽量小 |
| pthread_mutex_destroy | 销毁 mutex | 不再使用后释放相关资源 |
| sem_init | 初始化信号量 | pshared 为 0 表示同一进程内线程共享 |
| sem_wait | 信号量值大于 0 时减 1，否则阻塞 | 可用于等待资源或事件 |
| sem_post | 信号量值加 1，并可能唤醒等待线程 | 可用于通知其他线程 |
| pthread_barrier_wait | 等待所有线程到达 barrier | barrier 是同步点，不是互斥 |
| pthread_cond_wait | 等待条件变量，并临时释放关联 mutex | 被唤醒后要重新检查条件 |
| pthread_cond_signal | 唤醒一个等待条件变量的线程 | 不保证具体唤醒哪个线程 |
| pthread_cond_broadcast | 唤醒所有等待条件变量的线程 | 唤醒不等于条件一定成立 |
| pthread_rwlock_rdlock | 获取读锁 | 多个读线程可以同时进入 |
| pthread_rwlock_wrlock | 获取写锁 | 写线程独占，读写都被阻塞 |
| pthread_rwlock_unlock | 释放读写锁 | 读锁和写锁都用 unlock 释放 |

## 13. 题型

**1. Pthreads基本题型**

**全局变量：**

pthread_mutex_t mutex;

其他，如计数器，N，T等（某些被写入的需要被mutex保护）



**int main函数：**

读参数

分配空间malloc

初始化锁pthread_mutex_init

创建线程 pthread_t* threads = malloc(T * sizeof(pthread_t));

For 构建每个线程的参数+pthread_create

For pthread_join()

释放锁 pthread_mutex_destroy

释放空间free



**void* thread_func(void * arg)线程函数**：

参数强制类型转换

先算局部（不用保护）

后汇总到全局（mutex保护）

**2.同步题**

While(true){抢mutex 获得后循环检查条件，失败继续wait，检查完成唤醒全部 break，执行业务，唤醒全部}

# 第六章 OpenMP：较高层共享内存编程

## 1. 定义/基本概念

**定义**：OpenMP 是面向**共享内存系统**的并行编程 API，主要由**编译指示 pragma**、**运行时库函数**和**环境变量**组成。

OpenMP 的适用前提：

- 多个线程或核心可以访问同一内存地址空间（共享内存系统）
- 程序中存在可以并行执行的循环或任务
- 希望在串行 C 程序上做较小修改（复杂的不行）

使用核心机制：

- 程序员用 pragma 告诉编译器哪些区域可以并行
- 编**译器和运行时系统**负责创建线程、分配工作和做部分同步
- 不支持 OpenMP 的编译器会忽略未知 pragma

## 2. 模型

### 2.1 基本模型

**定义**：parallel directive 会创建一个**并行区域**。程序执行到该区域时，原线程 fork 出一组线程共同执行代码块；区域结束时再 join。

相关术语：

- **team**：执行 parallel block 的线程集合
- **master thread**：原始线程。PPT 使用旧术语 master
- **worker thread**：额外创建的线程。PPT 可能写 slave
- **clause**：修饰 directive 的附加说明，例如 num_threads

基本形式：

```c
#pragma omp parallel num_threads(thread_count)
{
    int my_rank = omp_get_thread_num();
    int actual_threads = omp_get_num_threads();
    printf("Hello from thread %d of %d\n", my_rank, actual_threads);
}
```

注意：

- num_threads(n) 表示**请求**使用 n 个线程
- OpenMP 标准**不保证一定启动 n 个线程**，实际数量还受运行时系统和系统资源限制
- parallel 区域内部所有线程都会执行同一段结构化代码
- 多线程输出顺序不确定，这是调度导致的正常现象

### 2.2 Parallel for

三者区别：

- parallel：只创建并行区域和fork team（线程组），每个线程都执行这个并行区域
- for：不创建新线程，只把循环迭代分给**已有 team**（即每个线程只执行其中部分迭代）
- parallel for：parallel + for 的简写，既创建 team，又分配循环

例子：

```c
#pragma omp parallel
{
    #pragma omp for
    for (int i = 0; i < n; i++) {
        y[i] = a[i] + b[i];
    }
}
```

等价理解：

```c
#pragma omp parallel for
for (int i = 0; i < n; i++) {
    y[i] = a[i] + b[i];
}
```

合法循环形式要求：

- 循环变量必须是整数或指针类型
- start、end、incr 类型兼容
- start、end、incr 在循环执行期间不能改变
- 循环变量只能由 for 的增量表达式修改

不能直接 parallel for 的核心情况：

- **一个迭代读写依赖另一个迭代的结果**，例如 Fibonacci：fibo[i] 依赖 fibo[i-1] 和 fibo[i-2]

### 2.3 变量作用域

**定义**：OpenMP 中变量作用域指变量能被**哪些线程**访问，即一组线程的集合（C语言中是可以被使用的地方）

类型：

- **shared**：线程组中所有线程访问同一个变量
- **private**：每个线程有自己的变量副本

默认规则：

- parallel block **前声明的变量通常默认 shared**
- parallel block **内声明的局部变量通常是 private**
- parallel for 的**循环变量通常按私有变量**处理

default clause：凡是在并行区域外声明、又在并行区域里使用的变量，都必须显式说明 shared / private / reduction 等属性。

例子：

```c
#pragma omp parallel for default(none) shared(a, b, n) private(i)
for (i = 0; i < n; i++) {
    a[i] = b[i] + 1;
}
```

### 2.4 互斥：critical atomic lock

OpenMP 中多个线程同时更新共享变量时，也会出现**竞争条件**。

critical 指令：保证同一时刻只有一个线程执行后面的结构化代码块，缺点是会让这部分代码串行化

```c
#pragma omp critical
global_result += my_result;
```

named critical：

- 同名 critical 互斥
- 不同名字的 critical 可以同时执行
- 名字在编译时确定，不适合运行时动态生成很多不同临界区

atomic 指令：只保护一条简单的读-改-写语句，比 critical 更轻量

```c
#pragma omp atomic
sum += x;
```

lock：

- 是显式锁，需要初始化、加锁、解锁、销毁
- 适合更细粒度或更复杂的共享数据结构

互斥机制限制：

- 不要用不同互斥机制保护同一个临界区
- critical 不一定会和 atomic 互斥
- OpenMP 互斥结构不保证公平性
- 嵌套互斥结构可能导致死锁或难以分析的等待

### 2.5 reduction

**定义**：reduction 是反复对一组操作数应用同一个二元运算，最终得到一个结果的计算。

reduction clause 的作用：为每个线程创建私有局部结果，各线程独立更新自己的局部结果，并行区域结束时安全合并成一个全局结果

常见 reduction **运算符**：

- +、*、-
- &、|、^
- &&、||

例子，向量内积：

```c
double sum = 0.0;

#pragma omp parallel for reduction(+:sum)
for (int i = 0; i < n; i++) {
    sum += a[i] * b[i];
}
```

## 3. 循环调度 schedule

**定义**：schedule 决定 parallel for 的循环迭代如何分配给线程。

基本形式：

```c
#pragma omp parallel for schedule(type, chunk_size)
for (int i = 0; i < n; i++) {
    ...
}
```

### 3.1 static

**定义**：在循环开始前将迭代分配给线程。

**常见形式**：

- schedule(static)：通常是连续块划分
- schedule(static, c)：每 c 个连续迭代作为一个 chunk，按线程编号轮询分配

**适合**：

- 每次迭代工作量差不多
- 希望调度开销低
- 数据局部性较重要

例子，N = 16，4 个线程，schedule(static)：

- 线程 0：0、1、2、3
- 线程 1：4、5、6、7
- 线程 2：8、9、10、11
- 线程 3：12、13、14、15

例子，N = 16，4 个线程，schedule(static, 2)：

- 线程 0：0、1、8、9
- 线程 1：2、3、10、11
- 线程 2：4、5、12、13
- 线程 3：6、7、14、15

### 3.2 dynamic

**定义**：迭代被分成 chunk，线程完成一个 chunk 后再向运行时请求下一个。

- schedule(dynamic)：c=1
- schedule(dynamic, c)：每 c 个连续迭代作为一个 chunk，线程完成当前 chunk 后，再向运行时系统请求下一个 chunk。最终谁拿到哪个 chunk，取决于线程完成速度。

适合：

- 迭代**工作量不均匀**
- 需要**动态负载均衡**

缺点：

- 调度**开销更高**
- 数据**局部性可能下降**

### 3.3 guided

**定义**：**类似 dynamic，但 chunk 大小会逐渐减小**。

含义：

- 前期用**大 chunk** 减少调度开销
- 后期用**小 chunk** 改善负载均衡

适合：

- 任务不均匀
- 又不希望 dynamic 的调度开销太高

### 3.4 auto 和 runtime

auto：

- 由编译器或运行时系统决定调度方式

runtime：

- 由运行时环境变量 OMP_SCHEDULE 决定调度策略

**总结：**

1. **均匀任务通常 static 更好，调度开销小；不均匀任务才需要 dynamic 或 guided。**

2. **chunk 越小负载越均衡，但调度开销越大，局部性也可能更差。**

## 4. 显式同步工具

barrier：

- 所有线程都到达屏障后，任何线程才能继续
- 常用于阶段之间的同步
- parallel 区域结束通常有隐式 barrier
- for 等构造末尾通常也有隐式同步，具体要看指令和子句

PPT 中的共享内存 message-passing 例子：

- 每个线程有一个共享消息队列
- 一个线程要给另一个线程发消息，就是把消息入队到对方队列
- 接收消息就是从自己的队列出队
- 队列是共享数据结构，所以入队、出队需要互斥
- 启动阶段需要 barrier，保证所有线程的队列都创建完成后，再开始发送消息

## 5. OpenMP 典型算法

### 5.0 思想：任务划分到线程分配

PPT 用梯形积分说明 OpenMP 的基本思路。

原问题可以拆成两类任务：

- 计算很多个小梯形面积
- 把这些面积加成一个总结果

直接为每个小梯形创建任务不合适，因为小任务太多，调度开销太大。

常见做法：

- 把很多小梯形聚合成较大的连续区间
- 每个线程负责一段区间，先得到自己的 my_result
- 最后把各线程结果合并成 global_result

核心矛盾：多个线程同时执行时会产生 race condition。

```c
global_result += my_result;
```

### 5.1 矩阵向量乘法

矩阵向量乘法 y = A x 中，每一行 y[i] 可以独立计算。

常见并行方式：

- 线程按行分配 A
- x 是共享只读
- A 是共享只读
- y 是共享写，但每个线程写不同 y[i]

```c
#pragma omp parallel for schedule(static)
for (int i = 0; i < m; i++) {
    y[i] = 0.0;
    for (int j = 0; j < n; j++) {
        y[i] += A[i*n + j] * x[j];
    }
}
```

PS：这个版本不需要 reduction，因为每个 y[i] 只由一个线程计算。如果多个线程共同累加同一个 y[i]，才需要 reduction 或其他同步。

### 5.2 奇偶换位排序

OpenMP 版本的核心不是通信，而是把同一阶段中的互不冲突比较对并行化。

- 每个阶段内部的比较对可以 parallel for
- 阶段之间有依赖，不能把所有阶段直接并行

## 6. OpenMP 期末指令和子句汇总

| 指令 / 子句 | 作用 | 易错点 |
|---|---|---|
| pragma omp parallel | 创建并行区域，由线程组执行代码块 | 实际线程数由运行时和系统限制共同决定 |
| num_threads(n) | 请求使用 n 个线程 | 不保证一定启动 n 个线程 |
| pragma omp for | 在已有 team 内划分 for 循环 | 自己不创建线程 |
| pragma omp parallel for | 把 for 循环迭代分给多个线程 | 循环迭代之间不能有依赖 |
| reduction(+:sum) | 每个线程私有累加，结束时合并 | 去掉后直接更新共享 sum 会 race |
| critical | 同一时刻只允许一个线程进入代码块 | 过大会降低并行度 |
| atomic | 保护单条简单读改写语句 | 不能替代复杂临界区 |
| barrier | 所有线程到达后再继续 | 并行区域结束通常有隐式 barrier |
| shared(x) | x 被线程组共享 | 多线程写共享变量要同步 |
| private(x) | 每个线程有自己的 x 副本 | 初值通常不自动继承 |
| default(none) | 要求显式声明变量作用域 | 有助于避免 scope 错误 |
| schedule(static) | 循环开始前静态分配迭代 | 均匀任务常用 |
| schedule(static, c) | 每 c 个迭代为一个 chunk，轮询分配 | static, 1 常用于考手算分配 |
| schedule(dynamic, c) | 线程完成一个 chunk 后再取新 chunk | 负载不均时有用，调度开销更高 |
| schedule(guided) | 动态调度，chunk 逐渐变小 | 折中调度开销和负载均衡 |
| schedule(runtime) | 由运行时环境变量决定调度 | 需要看 OMP_SCHEDULE |
| schedule(auto) | 由编译器或运行时系统决定 | 手算题一般不会用它 |

OpenMP 手算调度：

- static 默认常见为连续块划分
- static, c 是按 chunk 轮询分配
- 题目若说“假设实际启动 3 个线程”，就按 3 个线程算，不按 num_threads 写了多少猜

OpenMP 代码分析题优先看：

- 循环迭代之间有没有依赖
- 变量是 shared 还是 private
- 是否多个线程写同一个共享变量
- 是否应该用 reduction 而不是 critical
- schedule 如何把迭代分给线程
- 题目要求的是理论线程数，还是实际启动线程数

# 第七章 CUDA：GPU 编程模型、内存模型与性能优化

## 1. CUDA 的定位

**定义**：CUDA 是 NVIDIA GPU 的异构并行编程模型，程序由 CPU 端 host 代码和 GPU 端 device 代码共同组成。

CPU：

- 面向**低延迟**
- 擅长**复杂控制流**和快速串行执行
- 使用较大的**缓存**和复杂控制逻辑掩盖存储器延迟

GPU：

- 面向**高吞吐量**
- 使用大量轻量级线程处理**控制流简单、数据量大**的任务
- 单个线程不一定快，但可以用大量线程隐藏访存延迟

CUDA 性能优化的第一判断：

- **计算是否足够多**，能否抵消 kernel 启动和数据传输开销
- 是否**避免频繁在 CPU 和 GPU 之间切换**
- 是否**避免大量 host/device 内存拷贝**
- 线程访问内存的模式是否匹配 GPU 硬件

## 2. CUDA 程序模型

基本角色：

- **host**：CPU 端代码
- **device**：GPU 端代码
- **kernel**：由 host 启动、在 device 上由大量线程执行的函数

常见函数修饰：

- `__host__`：host 端函数
- `__device__`：device 端函数，只能由 device 端代码调用
- `__global__`：kernel：host 调用，device 执行

线程层次：

- **thread**：最小执行单位
- **warp**：硬件调度单位，通常 32 个线程
- **block**：线程块，同一 block 内线程可以**共享** shared memory，并可用 `__syncthreads()` **同步**（不同 block 之间不能）
- **grid**：一次 kernel 启动中的全部 block
- **SM**：Streaming Multiprocessor，GPU 上实际调度和执行 block/warp 的**硬件单元**

映射关系：

- 一个 kernel 启动一个 grid
- grid 由多个 block 组成
- block 被调度到 SM 上执行
- block 内线程被划分成 warp
- SM 以 warp 为单位调度执行

PS：block 是 CUDA 中最重要的边界。同一 block 内能共享内存和同步；不同 block 之间不能假设执行顺序，也不能用普通 barrier 同步。

## 3. 透明可扩展性

**定义**：同一 CUDA 程序可以在不同数量执行资源的 GPU 上运行，只是性能不同，这称为透明可扩展性。

原因：

- 程序员把任务拆成大量 block
- GPU runtime 把 block 分配给 SM
- SM 多的 GPU 可以同时执行更多 block
- SM 少的 GPU 可以分批执行 block

限制：

- block 之间不应依赖执行先后顺序
- 如果需要全局同步，通常拆成多个 kernel
- 单个 kernel 内普通 `__syncthreads()` 只能同步同一 block 的线程

## 4. 线程坐标和数据下标

线程组织方式和数据内存布局可以独立。

矩阵通常按行主序存放，即一维数组中每行连续。

二维矩阵加法常见写法：

```c
__global__ void matrix_add(int *A, int *B, int *C, int n, int m) {
    int x = blockDim.x * blockIdx.x + threadIdx.x;
    int y = blockDim.y * blockIdx.y + threadIdx.y;

    if (y < n && x < m) {
        C[y * m + x] = A[y * m + x] + B[y * m + x];
    }
}
```

含义：

- n 是行数
- m 是列数
- x 对应列
- y 对应行
- 行主序下标是 y × m + x

启动配置：

```c
dim3 block(16, 16, 1);
dim3 grid(divup(m, 16), divup(n, 16), 1);
matrix_add<<<grid, block>>>(A, B, C, n, m);
```

divup：

\[
divup(a,b)=\frac{a+b-1}{b}
\]

常见计算：

- grid.x = divup(列数, blockDim.x)
- grid.y = divup(行数, blockDim.y)
- 每个 block 线程数 = blockDim.x × blockDim.y × blockDim.z
- 总线程数 = grid 中 block 数 × 每个 block 线程数
- 可能有越界线程，所以 kernel 内要写边界判断

例子：

- n = 1000，m = 1000
- block = (16, 16, 1)
- grid = (63, 63, 1)
- blockIdx = (2, 3, 0)，threadIdx = (5, 7, 0)

则：

- x = 2 × 16 + 5 = 37
- y = 3 × 16 + 7 = 55
- 一维下标 = 55 × 1000 + 37

PS：二维 grid/block 更直观，但不一定最高效。效率最终取决于同一 warp 内线程访问的地址是否连续。

## 5. GPU kernel 内存层次

本节说的是 **kernel 执行时，GPU 线程能访问哪些存储空间**。全部为逻辑上的。

这些存储空间按作用域、生命周期、位置和访问代价区分。

| 存储 | 典型声明 | 作用域 | 生命周期 | 位置 | 特点 |
|---|---|---|---|---|---|
| 寄存器 | 普通局部标量 | 单线程 | 线程 | 片上 | 最快 |
| 本地内存 | 大局部数组、寄存器溢出变量 | 单线程 | 线程 | 片外，可缓存 | 逻辑私有，但不一定快 |
| 共享内存 | `__shared__` | 单个 block | block | 片上 | 程序员显式管理 |
| 全局内存 | `cudaMalloc` 得到的指针 / `__device__` | 所有线程 | 应用程序 | 片外 | 容量大，延迟高 |
| 常量内存 | `__constant__` | 所有线程只读 | 应用程序 | 片外，有常量缓存 | 适合统一读取 |
| 只读/纹理内存 | `__ldg` / texture | 所有线程只读 | 应用程序 | 片外，有专用缓存 | 适合只读和空间局部性 |

其中：

- **全局内存 global memory** 是 kernel 视角下所有线程都能访问的大容量内存空间
- `cudaMalloc` 分配出来的 GPU 数据，kernel 访问时通常就属于全局内存访问
- `__device__` 声明的变量也在全局内存空间

没有修饰符的变量：

- 普通局部标量通常在寄存器
- 过大的局部数组、下标编译期无法确定的局部数组，可能进入本地内存
- 本地内存名字叫 local，但物理上常在全局内存区域，访问代价可能很高

## 6. Host-device 内存管理

本节说的是 **CPU 和 GPU 之间数据怎么分配、传输和管理**。

它和上一节的关系：

- **host memory**：CPU 侧内存，不在 kernel 内存层次表里
- **device memory**：GPU 侧物理内存；kernel 通常把其中的大数组当作 global memory 访问
- **unified memory**：托管内存管理方式；不是新的片上快速内存，kernel 侧通常仍按 global memory 理解

### 6.1 Host memory

**定义**：host memory 是 CPU 侧内存，也就是普通 C/C++ 程序用 `malloc` / `new` 分配的内存。

例子：

```c
int *h_A = malloc(N * sizeof(int));
```

特点：

- CPU 可以直接读写
- 普通 GPU kernel 不能把它当普通 device 数据直接高效访问
- 要给 GPU 使用，通常需要拷贝到 device memory

### 6.2 Device memory

**定义**：device memory 是 GPU 侧内存，通常由 `cudaMalloc` 分配。

例子：

```c
int *d_A;
cudaMalloc(&d_A, N * sizeof(int));
```

注意：

- `d_A` 这个指针变量在 host 代码里使用
- 但它指向的是 GPU 上的 device memory
- kernel 访问 `d_A[tid]` 时，就是访问 GPU 全局内存

管理方式：

- host 端用 `cudaMalloc` 在 device 上分配
- 用 `cudaMemcpy` 在 host 和 device 之间传输
- 用 `cudaFree` 释放

典型流程：

```c
cudaMalloc(&d_A, size);
cudaMemcpy(d_A, h_A, size, cudaMemcpyHostToDevice);
kernel<<<grid, block>>>(d_A);
cudaMemcpy(h_A, d_A, size, cudaMemcpyDeviceToHost);
cudaFree(d_A);
```

静态 device/global 变量：

- 用 `__device__` 声明
- host 端用 `cudaMemcpyToSymbol` / `cudaMemcpyFromSymbol` 拷贝

### 6.3 Unified memory

**定义**：unified memory 是 CUDA 的托管内存。CPU 和 GPU 使用同一个指针，系统负责在 host 和 device 之间迁移数据。

例子：

```c
int *A;
cudaMallocManaged(&A, N * sizeof(int));
```

- 用 `cudaMallocManaged` 分配
- host 和 device 使用同一个指针
- 底层系统负责在 CPU/GPU 间迁移页面

统一内存优点：

- 简化内存管理
- 更容易把 C/C++ 程序迁移到 CUDA
- 复杂数据结构更容易写

统一内存限制：

- 只是虚拟统一，物理上 CPU 和 GPU 内存仍可能分离
- 数据仍然需要通过 PCIe 或 NVLink 迁移
- 需要同步保证数据可见性
- 性能通常不如显式控制内存

PS：考试问 host memory、device memory、unified memory 时，核心是：host 在 CPU 侧，device 在 GPU 侧，unified memory 提供统一指针但不等于没有数据传输成本。

PS：**全局内存**是 kernel 视角的存储空间；**device memory** 是 CPU/GPU 内存管理视角的 GPU 侧内存。课程里很多时候可以近似认为 `cudaMalloc` 得到的 device memory 在 kernel 中就是 global memory，但二者不是同一个层级的术语。

## 7. CUDA 同步和原子操作

CUDA 中常见同步机制：

- **`__syncthreads()`：同一 block 内线程同步**
- kernel 边界：同一 stream 中后一个 kernel 会在前一个 kernel 完成后执行
- **`cudaDeviceSynchronize()`：host 等待 device 上已提交任务完成**
- event / stream 同步：用于更细粒度的 host-device 或 stream 间同步
- **atomic 操作：保证对某个地址的读-改-写原子完成，但它不是 barrier**

`__syncthreads()` 适用：

- block 内线程协作把全局内存数据加载到 shared memory
- 必须等所有线程写完 shared memory 后，其他线程才能读

原子操作：

**定义**：原子操作保证一个读-改-写过程不可被其他线程打断。

例子：

```c
atomicAdd(&d_counter, 1);
```

适用：

- 多个线程更新同一个计数器
- 直方图统计
- 并行归约中的部分累加

性能问题：

- 大量线程同时原子更新同一地址会串行化
- 可以先在 block 内局部统计，再用少量 atomic 更新全局结果

PS：`__syncthreads()` 解决“同一 block 内大家等一等”；atomic 解决“多个线程同时更新同一地址不要写坏”。它们不是同一种工具。

## 8. 全局内存合并访问

**定义**：合并访问是同一 warp 中线程访问的全局内存地址可以被硬件合并成较少内存事务。

理想模式：

- 同一 warp 中相邻线程访问相邻地址
- 数据对齐
- 访问落在少量连续 cache line / memory segment 中

不利模式：

- 相邻线程访问跨步很大
- 行主序矩阵按列访问
- AoS 结构导致成员访问变成固定步长访问
- 线程索引和数据布局不匹配

二级缓存视角：

- L2 cache line 通常按 32B 粒度处理
- warp 中 32 个线程每个读 4B，连续访问共 128B
- 理想情况下需要 4 个 32B 事务，总线利用率 100%
- 非对齐连续访问可能需要 5 个 32B 事务，利用率约 80%
- stride = 4 时可能需要 16 个事务，利用率约 1/4
- 最差情况可能需要 32 个事务

行主序矩阵判断：

\[
M[row \times W + (col + t)]
\]

t = 0,1,...,31 时，地址连续，适合合并访问。

\[
M[(row + t) \times W + col]
\]

t = 0,1,...,31 时，地址相差 W，通常不利于合并访问。

PS：全局内存优化先看 coalescing。不要只看单个线程访问了什么，要看同一个 warp 的 32 个线程一起访问了什么。

## 9. 常量内存、只读缓存和纹理内存

### 9.1 常量内存

**定义**：常量内存是 device 端只读内存，物理上在 GPU DRAM 中，但每个 SM 有常量缓存。

适合：

- 少量只读数据
- kernel 执行期间不变
- 同一 warp 中线程访问同一地址

最优访问：

```c
__constant__ int const_var[16];

__global__ void kernel() {
    int i = blockIdx.x;
    int value = const_var[i % 16];
}
```

同一 block 内线程读取同一个常量地址，可通过常量缓存广播。

较差访问：

```c
__constant__ int const_var[16];

__global__ void kernel() {
    int i = blockIdx.x * blockDim.x + threadIdx.x;
    int value = const_var[i % 16];
}
```

同一 warp 中线程读取多个不同常量地址，可能按唯一地址数串行化。

常见例子：

- 卷积核权重
- 固定系数

PS：常量内存不是“数据是常量就一定快”。它真正适合的是 warp 内统一读取。

### 9.2 只读缓存和纹理内存

只读缓存：

- 数据只读
- 适合 warp 内线程访问不同地址但仍有缓存价值的场景
- 可用 `__ldg()` 或 `const __restrict__` 提示只读访问

纹理内存：

- 原本为图形访问设计
- 支持高维空间局部性
- 适合二维或三维空间访问模式明显的计算
- 可配置 address mode 和 filter mode

区别：

- 常量缓存适合统一读取
- 只读缓存适合分散读取
- 纹理缓存适合高维空间局部性

## 10. 共享内存

**定义**：共享内存是同一 block 内线程可共享的片上存储，可看作程序员显式管理的缓存。

特点：

- 作用域是 block
- 速度快，容量小
- 需要程序员显式加载、同步和使用
- 不同 block 不能通过 shared memory 通信

典型流程：

- 把全局数据划分为 tile
- block 内线程协作把 tile 从 global memory 载入 shared memory
- 使用 `__syncthreads()` 等待加载完成
- 在 shared memory 上重复使用数据
- 必要时写回 global memory

静态共享内存：

```c
__shared__ float tile[BDIM][BDIM];
```

动态共享内存：

```c
extern __shared__ float smem[];
kernel<<<grid, block, smem_size>>>(...);
```

适用例子：

- stencil：相邻输出反复使用重叠输入
- 矩阵乘法：A、B 的 tile 被多个线程重复使用
- 矩阵转置：用 shared memory 改变访存方向，使全局读写更容易合并

PS：用了 shared memory 不一定更快。它的收益来自减少重复全局访存或改善全局访存模式；如果访问模式不好，还可能引入 bank conflict。

## 11. bank conflict

**定义**：共享内存被分成多个 bank。同一 warp 中多个线程访问同一个 bank 的不同地址时，会发生 bank conflict，访问被串行化。

规则：

- 共享内存通常有 32 个 bank
- 不同 bank 可以并行访问
- 同一地址广播不算 bank conflict
- bank conflict 只在同一个 warp 内讨论

设 float 数组 `smem[index]` 的 bank 为 index % 32。

常见模式：

- `smem[t]`：线程 t 访问 bank t，无冲突
- `smem[2*t]`：只访问偶数 bank，可能 2-way conflict
- `smem[0]`：所有线程访问同一地址，广播访问，不算 conflict

消除方式：

- padding，例如二维 tile 多加一列
- 改变共享内存下标映射
- 避免 warp 内线程以冲突步长访问 shared memory

矩阵转置常见写法：

```c
__shared__ int tile[BDIM][BDIM + 1];
```

`+1` 的目的不是多存一个有效数据，而是改变每行 stride，让列访问不再集中落到同一批 bank。

PS：全局内存关注 coalescing；共享内存关注 bank conflict。两个问题都发生在 warp 访问模式层面，但对应的存储层次不同。

## 12. 占用率和线程块大小

**定义**：occupancy 表示 SM 上活跃 warp 数量占最大活跃 warp 数量的比例。

\[
occupancy=\frac{active\ warps}{maximum\ active\ warps}
\]

影响因素：

- 每个线程使用的寄存器数
- 每个 block 使用的 shared memory
- 每个 block 的线程数
- 每个 SM 支持的最大 block 数和最大 warp 数

**提高 occupancy 的好处：**

- **当一个 warp 等待全局内存时，SM 可以切换到其他 warp**
- **有助于隐藏访存延迟**

限制：

- occupancy 不是越高越好
- 为了提高 occupancy 而减少寄存器或 shared memory，可能降低缓存效率或增加访存
- 应在 occupancy 和每个线程/block 的资源之间平衡

线程块大小经验：

- block 内线程数最好是 warp size 32 的整数倍
- 避免 under-populated warp
- 每个 SM 至少有一个 block 可执行
- 更理想是每个 SM 有多个 block 可执行
- 单个 block 不应占用过多寄存器或 shared memory，否则会限制同时驻留的 block 数

PS：考试中如果问为什么 BDIM=32 不一定比 BDIM=16 快，可以答：**更大 block 可能占用更多资源，使每个 SM 驻留 block 数减少，降低隐藏延迟能力。**

## 13. 分支分化和原子操作性能

### 13.1 分支分化

**定义**：**同一 warp 内线程走不同控制分支时，GPU 会串行执行不同分支，称为分支分化。**

容易出现分支分化的情况：

- 判断条件依赖 threadIdx 或 tid
- 同一 warp 内一部分线程走 if，一部分线程走 else
- 两个分支执行时间差异很大

优化思路：

- 减少基于 threadIdx 的判断
- 把不同分支中的共同工作提取到分支外
- 尽量平衡分支工作量
- 能用简单表达式替代分支时，可考虑替代

例子：

```c
if (tid % 2) {
    output[tid] = a * a + b * b;
} else {
    output[tid] = a * a - b * b;
}
```

同一 warp 中奇偶线程交错，通常会发生分支分化。

一种改写思路：

```c
float sign = (tid % 2) ? 1.0f : -1.0f;
output[tid] = a * a + sign * b * b;
```

边界判断也要看：

- 如果代码访问 `input[tid*2]` 和 `input[tid*2+1]`
- 合法条件应保证 `tid*2+1 < size`
- 只写 `if (tid*2 > size) return;` 可能漏掉边界等于 size 的情况

PS：改写不一定总是更快，但分析题中要能指出“warp 内奇偶线程走不同分支，会导致分支分化”。

### 13.2 原子操作性能

原子操作保证正确性，但可能严重影响性能。

典型问题：

- 很多线程同时 `atomicAdd` 到同一个地址
- 这些更新会被串行化

优化思路：

- 每个 block 先在 shared memory 中做局部统计或局部归约
- 每个 block 只用少量 atomic 更新 global memory
- 即“两级原子操作”：block 内局部合并，再全局合并

## 14. 典型代码分析题

### 14.1 矩阵转置

朴素版本：

```c
__global__ void transpose(int *out, int *in, int n, int m) {
    int x = blockIdx.x * blockDim.x + threadIdx.x;
    int y = blockIdx.y * blockDim.y + threadIdx.y;

    out[x * n + y] = in[y * m + x];
}
```

功能：

- 输入矩阵中第 y 行 x 列的元素
- 写到输出矩阵中第 x 行 y 列
- 即矩阵转置

效率问题：

- 读 `in[y*m+x]` 时，相邻线程 x 连续，读通常合并
- 写 `out[x*n+y]` 时，相邻线程写地址跨步为 n，写通常不合并
- 这是矩阵转置的核心瓶颈
- 实际代码还应加边界判断，避免 x 或 y 越界

共享内存优化思路：

- 每个 block 读取一个 tile 到 shared memory
- 全局读时按行读，合并
- 在 shared memory 中完成 tile 内转置
- 全局写时也按行写，合并
- 用 padding 消除 shared memory 的 bank conflict

典型答案：

```c
__shared__ int tile[BDIM][BDIM + 1];
```

PS：矩阵转置优化题的标准关键词是：朴素版本写回非合并；shared tile 让全局读写都尽量合并；padding 解决 shared memory 转置访问时的 bank conflict。

### 14.2 矩阵乘法

朴素矩阵乘法：

- 每个线程计算 C 的一个元素
- A 的同一行会被重复读取
- B 的同一列或 tile 会被重复读取
- 全局内存访问多

共享内存分块：

- 每个 block 计算 C 的一个 tile
- 把 A 的 tile 和 B 的 tile 载入 shared memory
- block 内多个线程复用这些 tile
- 减少重复全局内存访问

PS：矩阵乘法用 shared memory 的核心不是“同步好看”，而是数据复用。

### 14.3 卷积

卷积常见优化：

- 卷积核权重较小、只读、kernel 期间不变，适合放常量内存
- 输入图像的局部窗口被相邻输出重复使用，适合放 shared memory tile
- shared tile 可以加 padding 观察或减少 bank conflict
- row-wise 划分通常比 column-wise 划分更容易产生合并访存

PS：作业里的卷积和矩阵转置，本质都在考“线程划分决定访存模式”。

## 15. CUDA 期末检查清单

基础概念题优先背：

- host、device、kernel 的含义
- thread、warp、block、grid、SM 的映射关系
- `__global__`、`__device__`、`__host__` 的区别
- host memory、device memory、unified memory 的区别
- `__syncthreads()`、kernel 边界、`cudaDeviceSynchronize()`、atomic 的作用边界
- global memory、constant memory、shared memory 的适用访问模式
- bank conflict 的定义和 padding 消除方法

代码分析题优先看：

- 坐标公式是否正确：x、y、tid、index
- 边界判断是否正确
- 同一 warp 内访问地址是否连续
- 是否有分支分化
- 是否有大量 atomic 更新同一地址
- shared memory 使用前后是否有 `__syncthreads()`
- shared memory 是否可能 bank conflict
- 是否可以用 shared tile 改善全局访存合并

PS：CUDA 题通常不是让你写完整复杂程序，而是让你识别“线程怎么映射到数据、访问是否连续、同步是否在正确层级、shared memory 是否真的带来好处”。

# 第八章 期末重点算法和并行程序开发方法

## 1. 本章复习边界

老师黑板上的算法重点是：向量加法、矩阵乘法、求和、排序。

本章优先级：

- 高优先级：能说明每个算法如何划分任务、哪里需要同步、哪里可能有访存瓶颈
- 中优先级：能把算法对应到 MPI / Pthreads / OpenMP / CUDA 的实现方式
- 低优先级：N-body、TSP 这类较复杂案例，理解它们体现的并行化问题即可

PS：算法题大概率不会要求写完整代码，而是考“任务怎么分、结果怎么合、哪里会 race、性能瓶颈在哪里”。

## 2. 向量加法

**定义**：给定两个向量 A 和 B，计算 C[i] = A[i] + B[i]。

并行性：

- 每个 C[i] 只依赖 A[i] 和 B[i]
- 不同 i 之间没有数据依赖
- 是最典型的数据并行

任务划分：

- OpenMP：parallel for，把不同 i 分给不同线程
- Pthreads：手动计算每个线程负责的下标区间
- MPI：每个进程保存一段向量，局部计算后必要时 Gather
- CUDA：每个 GPU 线程负责一个元素

CUDA 下标：

\[
tid = blockIdx.x \times blockDim.x + threadIdx.x
\]

边界判断：

\[
tid < n
\]

性能重点：

- 相邻线程访问相邻 A、B、C 元素，有利于全局内存合并访问
- 计算量很小，容易受内存带宽限制

PS：向量加法是“并行结构最干净”的例子，常用于理解 thread/block 和数据下标的对应关系。

## 3. 矩阵乘法

**定义**：给定 A(m × n) 和 B(n × k)，计算 C(m × k)，其中：

\[
C[i,j] = \sum_{p=0}^{n-1} A[i,p] \times B[p,j]
\]

并行性：

- 每个 C[i,j] 可以独立计算
- 不同输出元素之间没有写冲突
- 属于规则数据并行

常见任务划分：

- 按 C 的行划分：每个线程/进程负责若干行
- 按 C 的元素划分：每个线程负责一个 C[i,j]
- 按 tile 划分：每个线程块负责一个输出子矩阵

访存重点：

- 行主序存储中，连续访问同一行更友好
- 直接计算时，A 的行和 B 的列会被重复访问
- CUDA 中常用共享内存缓存 A 和 B 的 tile，减少全局内存重复访问

容易考的判断：

- 如果每个线程写不同 C[i,j]，通常没有数据竞争
- 如果多个线程共同累加同一个 C[i,j]，就需要 reduction 或同步
- GPU 版本要注意全局内存合并访问和共享内存 bank conflict

PS：矩阵乘法的核心不是公式本身，而是“输出独立 + 输入复用”。输入复用越明显，共享内存 / cache 优化越重要。

## 4. 求和和归约

**定义**：把一组数通过加法合并成一个结果，是 reduction 的典型例子。

串行形式：

\[
sum = a[0] + a[1] + ... + a[n-1]
\]

并行基本做法：

- 每个线程 / 进程先算自己的局部和
- 再把局部和合并成全局和

错误做法：

- 多个线程直接更新共享 sum
- 因为 sum += a[i] 不是原子操作，会产生数据竞争

正确做法：

- OpenMP：使用 reduction(+:sum)
- Pthreads：每个线程用私有 my_sum，最后用 mutex 或主线程合并
- MPI：使用 MPI_Reduce 或 MPI_Allreduce
- CUDA：常用 block 内共享内存树形归约，再跨 block 合并

树形归约：

- 集中到 master 加：master 负担 O(p)
- 两两合并：关键路径 O(log p)

PS：求和题通常考两个点：为什么共享 sum 会 race；为什么树形归约比 master 集中合并更好。

## 5. 排序

排序的并行化比向量加法和求和更复杂，因为元素之间有全局顺序关系。

本课程中更可能考的是奇偶换位排序。

### 5.1 奇偶换位排序

**定义**：奇偶换位排序由多个阶段组成，每个阶段只比较相邻元素对。

阶段规则：

- 偶阶段：比较 (0,1)、(2,3)、(4,5) ...
- 奇阶段：比较 (1,2)、(3,4)、(5,6) ...
- 每一对若顺序错误就交换
- 重复足够多轮后得到有序序列

并行性：

- 同一阶段内，不同相邻对互不重叠，可以并行比较交换
- 相邻阶段之间有依赖，必须阶段同步

共享内存实现：

- OpenMP 可以对每一阶段中的比较对 parallel for
- 每个阶段结束需要同步，否则下一阶段可能读到未完成交换的数据

MPI 实现：

- 每个进程负责一段数据或一个数据块
- 相邻进程在不同阶段交换边界数据
- Send/Recv 顺序要安全，否则可能死锁

PS：排序题的核心是“同阶段可并行，不同阶段要同步”。它不像向量加法那样所有迭代完全独立。

## 6. Foster 方法论（扩展）

并行程序开发可以按四步思考：

- **Partitioning**：把问题分解成尽可能多的任务
- **Communication**：识别任务之间需要交换的数据
- **Agglomeration**：把细粒度任务聚合成更合适的任务块，减少通信和调度开销
- **Mapping**：把任务映射到线程、进程或核心

PS：先分得足够细，是为了暴露并行性；后面再聚合，是为了控制开销。

## 7. N-body 问题（扩展）

### 7.1 问题定义

**定义**：N-body 问题是在一段时间内模拟一组相互作用粒子的速度和位置变化。

输入：

- 初始位置
- 初始速度
- 质量

输出：

- 某时刻的位置
- 某时刻的速度

基本物理关系：

- 粒子间力由万有引力决定
- 总力是其他粒子对当前粒子的力之和
- 加速度由牛顿第二定律 F = ma 得到
- 可用 Euler 方法近似更新位置和速度

### 7.2 Basic solver

Basic solver 对每个粒子 q，计算其他所有粒子对 q 的作用力。

并行性：

- 每个 q 的 total force 可独立计算
- pos 和 masses 只读
- forces[q] 只由负责 q 的线程写

因此 OpenMP 中两个主要循环通常无 race condition。

### 7.3 Reduced solver

Reduced solver 利用牛顿第三定律：

\[
f_{kq} = -f_{qk}
\]

好处：

- 粒子对之间的力只算一次

问题：

- 一个线程计算 f(q,k) 后，需要同时更新 forces[q] 和 forces[k]
- forces 数组同一元素可能被多个线程更新
- 产生 race condition

尝试方案：

- 对整个 forces 加一个锁：正确但严重串行化
- 每个粒子一个锁：锁粒度更细，但开销仍可能很高
- 每个线程维护私有 forces 数组，最后按粒子合并：减少竞争，但增加内存和合并成本

PS：Reduced solver 算术量减少，不代表并行性能一定更好。减少计算可能换来更多同步和更复杂的内存访问。

### 7.4 划分方式

block partition：

- 每个线程负责连续粒子
- 局部性可能好
- 在 reduced solver 中可能负载不均衡

cyclic partition：

- 粒子按轮转分配
- 更容易平衡三角形计算区域带来的工作量差异
- 局部性可能较差

## 8. N-body 的 API 选择（扩展）

OpenMP：

- parallel for 容易表达 basic solver
- 内部循环结束有隐式 barrier
- reduced solver 仍需处理 race condition

Pthreads：

- 局部变量默认私有，全局变量共享
- 需要显式计算每个线程负责的循环范围
- 需要显式 barrier

MPI：

- 每个进程有独立内存
- basic solver 可让每个进程持有全局位置数组和局部粒子
- reduced solver 可用 ring pass 让位置数据在进程环上传递

ring pass 思想：

- 每个进程把自己的粒子位置传给低 rank 邻居
- 同时从高 rank 邻居接收位置
- 每一阶段计算本地粒子与收到粒子之间的相互作用
- 继续转发收到的数据，直到覆盖所有粒子

PS：分布式内存版本不怕共享写 race，但通信设计会变成核心问题。

## 9. 树搜索和 TSP（扩展）

### 9.1 TSP 问题

**定义**：旅行商问题要求在给定城市和距离的情况下，找到访问所有城市并回到起点的最小代价路径。

特点：

- NP-complete
- 没有已知对所有情况都优于穷举搜索的算法
- 可表示为搜索树

### 9.2 深度优先搜索

递归 DFS：

- 代码直观
- 函数调用开销较多
- 并行化不如显式栈方便

非递归 DFS：

- 用栈保存 partial tour
- 更容易拆分栈并分配给线程或进程

### 9.3 best tour 更新

多个线程/进程找到更优路径时，需要更新全局 best tour。

优化思想：

- 只读 best cost 时不必加锁，否则所有读都会被串行化
- 如果本地解不更好，不尝试更新
- 如果本地解看起来更好，需要加锁后再次检查

为什么要“加锁后再检查”：

- 第一次检查可能读到旧的 best cost
- 另一个线程可能已经写入更优结果
- 加锁后如果不重新检查，可能把更差结果覆盖进去

PS：这是典型的 double-check 思想。第一次检查减少无谓锁竞争，第二次检查保证正确性。

## 10. 静态和动态树搜索划分（扩展）

静态划分：

- 先由一个线程用 BFS 生成足够多的 partial tours
- 把这些 partial tours 分给各线程
- 每个线程独立 DFS

优点：

- 实现简单
- 通信少

缺点：

- 子树大小可能差异很大，负载不均衡

动态划分：

- 线程没工作时等待或请求工作
- 有工作且工作足够多的线程拆分自己的栈
- 使用 condition variable 或消息机制通知

优点：

- 负载均衡更好

缺点：

- 同步复杂
- 终止检测困难

## 11. 分布式终止检测（扩展）

共享内存中可以用共享变量统计有多少线程没工作。

MPI 中更复杂：

- 每个进程只有自己的本地状态
- “某进程没工作”的消息和“某进程收到新工作”的消息可能乱序到达
- 简单计数可能误判全局终止

一种思路：守恒量算法。

- 初始时每个进程有 1 单位 energy
- 进程没工作时把 energy 发给进程 0
- 进程分出工作时，把 energy 分一半给接收者
- 当进程 0 收到总 energy 等于进程数时，说明没有工作在系统中流动

PS：分布式终止检测难，是因为“没有本地工作”不等于“全局没有工作”。

## 12. 选择 MPI、OpenMP、Pthreads 的判断

选择时主要看内存模型和通信/同步需求。

适合 MPI：

- 问题规模大，单机内存不够
- 数据天然可分布
- 通信相对少或可批量化
- 需要跨节点扩展

适合 OpenMP：

- 已有串行程序
- 主要并行点是规则循环
- 共享内存足够
- 同步需求不复杂

适合 Pthreads：

- 需要复杂线程同步
- 需要显式控制线程、队列、条件变量、动态工作分配
- 可以承担更高编程复杂度

共享内存通常优势：

- 通信代价低
- 编程上直接共享数据

分布式内存通常优势：

- 内存容量和节点数可扩展
- 每个进程本地缓存行为更可控
- 大规模问题可扩展性更好

PS：没有绝对最好的 API。并行程序设计首先要判断问题的内存需求、通信强度、同步复杂度和负载均衡难度。

# 易混点集中整理

## 1. 并发、并行、分布式

- 并发：多个任务在同一时间段内进行，不要求同时执行
- 并行：多个任务在同一物理时刻执行
- 分布式：多个地址空间或节点通过消息协作

## 2. 进程和线程

- 进程有独立地址空间
- 同一进程内线程共享地址空间
- MPI 主要是进程间消息传递
- Pthreads/OpenMP 主要是同一进程内多线程共享内存

## 3. 数据竞争和伪共享

- 数据竞争：多个线程访问同一逻辑数据且至少一个写，可能导致错误结果
- 伪共享：不同线程访问不同逻辑数据，但落在同一缓存行，主要导致性能下降

## 4. cache coherence 和 memory consistency

cache coherence 关注同一个内存位置在多个缓存中的值是否一致。

memory consistency 关注多个内存操作在多线程中被观察到的顺序规则。

PS：本课程课件重点在 cache coherence 和 false sharing，memory consistency 没有展开。

## 5. OpenMP reduction 和 critical

- critical：多个线程排队更新共享变量
- reduction：每个线程先更新私有副本，最后合并

对求和、点积这类运算，reduction 通常比 critical 更自然。

## 6. MPI Reduce 和 Allreduce

- Reduce：结果只到 root
- Allreduce：所有进程都得到结果

如果后续所有进程都要用全局结果，用 Allreduce 更直接。

## 7. CUDA global memory 和 shared memory

- global memory：所有线程可访问，容量大，延迟高，片外
- shared memory：同一 block 内线程共享，容量小，速度快，片上

shared memory 不是自动缓存。程序员必须显式加载、同步和使用。

## 8. coalescing 和 bank conflict

- coalescing：全局内存访问是否能合并，主要看 warp 内线程是否访问连续全局地址
- bank conflict：共享内存访问是否落到同一 bank，主要看 warp 内线程访问共享内存的地址映射

PS：二者都发生在 warp 访问模式层面，但对应的存储层次不同。
