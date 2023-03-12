# typescript-unit-testing-examples

This repository has some examples of Unit Testing using Jest and Typescript.

---

## Password checker
This repository contains a Test Driven Development (TDD) exercise based on a password checker. The requirements for the password checker are as follows:

- Length must be over 8 chars
- It must contain one uppercase letter
- It must contain one lowercase letter
- It must contain a special character

The password checker also returns the reason why a password isn't valid.

Once the exercise is completed, imagine there is a new requirement and you have to add a check password for admins that requires the use of numbers. With the approach I used to complete the first assignment, it is very easy to add this requirement, while keeping all my tests and functionality.

---

## Different types of doubles with Jest
In the project there is a directory called `doubles` where I exprimented with the different kinds of modules available in Jest.

The first two, `stub` and `fake` are pretty simple and there are only a few examples with them.

Mocks and spies are more complex so I made more examples for them.

In the `test/doubles` directory there are two files. 
- `OtherUtils.test.ts` contains examples of Mocks and Spies being used to track callbacks and to mimic behaviour of functions.

- `MockModules.test.ts` mocks the entire `OtherUtils.ts` module and also has an example on how to mock a external library such as `uuid`.

---

## Server app
This section of the project is based on a project developed by Alex Horea for his course [Unit Testing for Typescript & NodeJs Developers with Jest](https://www.udemy.com/course/unit-testing-typescript-nodejs/).

This part consists of the project in the `src/app/server_app` folder and our goal is to develop Jest tests to check the behaviour of the given project.

### Server app tests

This project has been tested using two approaches, London and Chicago.

The London approach aims to test every class in the project independently, so it needs to use a lot of mocks to avoid dependencies. This approach can be seen in `src/test/server_app`.

On the other hand, the Chicago approach aims to test functionality of modules, so it has lower mock usage since it will have more dependencies. This approach can be seen in `src/test/server_app2`.