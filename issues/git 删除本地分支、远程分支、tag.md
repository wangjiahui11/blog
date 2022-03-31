### git 查看删除 本地分支、远程分支、tag

- **查看分支**

```
git branch  查看本地

git branch -a 查看远程和本地

git branch -r  查看远程
```



- **删除本地分支**

```
git branch -d  <branchname>  

git branch -d  <branchname> <branchname> <branchname>    // 删除多个分支
```

- **删除本地tag**

```
git tag -d  <tagname> 

git tag -d  <tagname> <tagname> <tagname>    // 删除多个tag
```



- **删除远端分支**

```
git push origin --d <branchname>

git push origin --d <branchname> <branchname> <branchname>   // 删除多个
```

- **删除远端tag**

```
git push origin -d tag <tagname>

git push origin -d tag <tagname> <tagname> <tagname>    // 删除多个tag
```



- **批量删除本地分支**

```
/* 删除匹配到的feature，保留其他的分支 */
git branch | grep 'feature' | xargs git branch -D

/* 只想保留master和develop正在开发中的分支，删除所有其他的分支 */
git branch | grep -v -E 'master|develop' | xargs git branch -D 
```

- **批量删除本地tag**

```
/* 删除匹配到的tag-v1，保留其他的tag */
git tag | grep "tag-v1" |xargs git tag -d

/* 只想保留v2.0.0和v1.1.1，删除所有其他的分支 */
git tag | grep -v -E "v2.0.0|v1.1.1" |xargs git tag -d

/* 删除全部本地tag */
git tag | xargs -I {}  git tag -d {}   
```



- **批量删除远程分支**

```
/* 删除匹配到的feature，保留其他的分支 */
git branch -r| grep 'featurep' | sed 's/origin\///g' | xargs -I {} git push origin :{}

/* 只想保留master和develop正在开发中的分支，删除所有其他的分支 */
git branch -r| grep -v -E 'master|develop' | sed 's/origin\///g' | xargs -I {} git push origin :{}
```

 **备注：如果有些分支无法删除，是因为远程分支的缓存问题，可以使用 git remote prune**



- **批量删除远端tag**

```
/* 删除匹配到的tag-v1，保留其他的tag */

git show-ref --tag | awk '/^v/ {print ":"$2}' | xargs -I {} git push origin :refs/tags/{}

/* 只想保留v2.0.0和v1.1.1，删除所有其他的分支 */
git tag | grep -v -E "v2.0.0|v1.1.1" |xargs git tag -d
```



- **用到命令说明**

```
grep -v -E  意思是 排除 master 和 develop

-v 排除

-E 使用正则表达式

xargs 将前面的值作为参数传入 git branch -D 后面

-I {} 使用占位符 来构造 后面的命令

/*
`grep` 名称是 global regular expression print（全局正则表达式输出)的缩写，是Linux 提供的一个搜索工具，搭配不同参数使用，几乎可以做到搜索任何东西，文件，文件夹，文本内容，搜索结果的总数等。
*/
```

参考：[Git-骚操作之批量删除分支](https://blog.csdn.net/qq_32452623/article/details/86317091)

