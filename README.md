## Starting the App

Run `npm install` to install dependencies first, and then run `ng serve` to start the app.

---

## Solution Architecture

- A `router-outlet` has been added (because I often work with it), and a page was created to encapsulate all the logic.
- The `user-management-page` component is designed as a form **host component**, like orchestrator of the forms. It implements interfaces and can repeat, validate, or manage any form layout (not just the "Create User" form).

_Host component does not know what forms are within the page, and the form components do not know about the host-component._
_The host component does not have to be `UserManagementPage` exactly, it can be any component implementing the host interface._

- The child `create-user-form` is a simple, independent form component that can inform (register itself with) the parent host component.
- The `create-user` component encapsulates the fields and logic for creating a user. The idea was to encapsulate all form logic in a single component that can either be injected into a host component or used independently.
- Each field is implemented using a **base input field** class with `ControlValueAccessor` logic. This approach, while less convenient, provides greater power and flexibility.
    - For example, independent fields can be reused anywhere in the application, sharing common logic in JavaScript (`InputFieldBaseClass`) and templates (`input-field-ui` component), which encapsulate Bootstrap validation messages and icons.

- Of course, the `user-management-page` could be refactored further, but I didn't have enough time. It could be split into smaller components and enhanced with pipes to improve maintainability.
