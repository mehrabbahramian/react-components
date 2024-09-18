# React TypeScript Components

<p>A collection of reusable, customizable React components built with TypeScript. These components are ready to be copied and adapted into your React projects.</p>

## Table of Contents

1. [Introduction](#introduction)

2. [Usage](#usage)

3. [Components](#components)
    - [Base Component Props](#base-component-props)
    - [Accordion](#accordion)

4. [Props Documention](#props-documention)
    - [Accordion Props](#accordion-props)

5. [Contributing](#contributing)

6. [License](#license)

---

## Introduction

<p>This repository provides a collection of common React components built using TypeScript. You can directly copy the component files and integrate them into your project.

These components are designed with flexibility in mind, so you can easily customize them to fit your needs.</p>

## Usage

1. Clone the repository or copy the components you need from the src/components/ folder into your project.
    ```bash
        git clone http://github.com/mehrabbahramian/react-components
    ```

2. Import the component into your project after copying it:
    ```bash
        import Button from './components/Button'; // Update path based on where you place the component

        const App = () => {
          return (
            <div>
              <Accordion props >
                {/* children */}
              </Accordion>
            </div>
          );
        };

        export default App;

    ```

3. Customize the component as needed by adjusting the props or modifying the code.

---

## Props Documention

### Base Component Props
| Prop      | Type              | Required | Default   | Description                       |
|-----------|-------------------|----------|-----------|-----------------------------------|
| `id`      | `string`          | no       | —         | To give specific id to component  |
| `name`    | `string`          | no       | —         | Give a name to component          |
| `classList`| `string[]`       | no       | _         | Array of classNames to style component|
| `style`   | `React.CSSProperties`| no    | _         | CSS props to style component      |

### Accordion Props
| Prop      | Type              | Required | Default   | Description                       |
|-----------|-------------------|----------|-----------|-----------------------------------|
| `Children`      | `React.ReactNode`| no       | —         | react node to show in accordion body|
| `getHeader`      | `() => React.ReactNode`| no| —         | react node to show in accordion header|

---

## Contributing

<p>Contributions are welcome! If you'd like to add new components or improve existing ones:</p>

1. Fork the repository.

2. Create a new branch for your changes:
    ```bash
        git checkout -b feature/your-feature-name
    ```

3. Make your changes and commit them:
    ```bash
        git commit -m "Add feature or fix description"
    ```

4. Push the changes to your fork:
    ```bash
        git push origin feature/your-feature-name
    ```

5. Open a pull request.

<p>Feel free to also submit bug reports or suggestions through GitHub Issues.</p>

## License

<p>This repository is licensed under the MIT License. You are free to copy, modify, and use the components for personal or commercial projects.</p>