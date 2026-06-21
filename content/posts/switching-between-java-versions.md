---
title: "Switching Between Java Versions"
date: 2022-02-16T21:47:54-05:00
readTime: 5
tags: ["java", "tutorial", "jdk"]
draft: false
---

Problem: How do I quickly change between Java versions in the terminal?<!--more-->

I'm currently doing development on an array of different Java apps. For the longest time, all of the apps I was working with only used Java 8. My team is now moving towards a Java 11 stack, so I can't run these apps with just the Java 8 JDK anymore.

This solution is for the zsh shell on a Mac computer.

The key lies with the `JAVA_HOME` environment variable. This dictates what version of Java to run when a command is executed. Using aliases, you will be able to quickly set this environment variable.

## List out all installed JDKs

Macs have an executable under `/usr/libexec/java_home` that can quickly list all installed JDKs, and get the Java path for any of these individual JDKs.

Enter the command `/usr/libexec/java_home -V` to get the list of installed JDKs. The output will look like this:

```
Matching Java Virtual Machines (2):
    11.0.14 (x86_64) "Oracle Corporation" - "Java SE 11.0.14" /Library/Java/JavaVirtualMachines/jdk-11.0.14.jdk/Contents/Home
    1.8.0_281 (x86_64) "Oracle Corporation" - "Java SE 8" /Library/Java/JavaVirtualMachines/jdk1.8.0_281.jdk/Contents/Home
```

There's 2 installations of Java - 11.0.14 and 1.8.0_281.

## Get the path of a specific JDK installation

`/usr/libexec/java_home -v 11` will display the path of your Java 11 installation:

```
/Library/Java/JavaVirtualMachines/jdk-11.0.14.jdk/Contents/Home
```

If you have even more than 2 installations, you can get the path of a specific Java minor version. For example, `/usr/libexec/java_home -v 1.8.0_281` will look like this:

```
/Library/Java/JavaVirtualMachines/jdk1.8.0_281.jdk/Contents/Home
```

## Changing the Java version

Using these commands to get a Java installation path, you can quickly change the `JAVA_HOME` environment variable using the `export` command.

- Set Java 8: ``export JAVA_HOME=`/usr/libexec/java_home -v 1.8.0_281` ``
- Set Java 11: ``export JAVA_HOME=`/usr/libexec/java_home -v 11` ``
- Check the current Java version: `echo $JAVA_HOME`

## Adding aliases to quickly change versions

1. `cd` - navigate to your home directory
2. With your preferred text editor (nano, vi, vim, etc.), open up the `.zshrc` file.
   - For example: `nano .zshrc`
3. Add the following lines to create new aliases:
   ```
   alias home='echo $JAVA_HOME'
   alias java8='export JAVA_HOME=`/usr/libexec/java_home -v 1.8.0_281`'
   alias java11='export JAVA_HOME=`/usr/libexec/java_home -v 11`'
   ```
4. Save, and restart the terminal for the changes to be applied.

Now, to change the Java versions the following commands can be used:

- `java8` - set version to Java 8
- `java11` - set version to Java 11
- `home` - output the current JAVA_HOME path to quickly check which version is active

Happy coding!
