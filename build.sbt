name := """project_awesome"""

version := "1.0.3"

lazy val root = (project in file(".")).enablePlugins(PlayJava)

scalaVersion := "2.11.1"

libraryDependencies ++= Seq(
  javaJdbc,
  javaEbean,
  cache,
  javaWs,
  "org.postgresql" % "postgresql" % "9.3-1100-jdbc4",
  "com.googlecode.lambdaj" % "lambdaj" % "2.3.3",
  "org.hamcrest" % "hamcrest-core" % "1.2.1"
)
