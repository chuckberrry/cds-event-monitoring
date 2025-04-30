# Event Mesh Monitoring Plugin

The `@cap-js/attachments` package is a [CDS plugin](https://cap.cloud.sap/docs/node.js/cds-plugins#cds-plugin-packages) that provides out-of-the box asset storage and handling by using an *aspect* `Attachments`. It also provides a CAP-level, easy to use integration of the SAP Object Store.

### Table of Contents

- [Event Mesh Monitoring Plugin](#event-mesh-monitoring-plugin)
    - [Table of Contents](#table-of-contents)
  - [Setup](#setup)
  - [Use Event Mesh Monitoring](#use-event-mesh-monitoring)
  - [Contributing](#contributing)
  - [Code of Conduct](#code-of-conduct)
  - [Licensing](#licensing)

## Setup

To enable attachments, simply add this self-configuring plugin package to your project:

```sh
 npm add @cap-js/attachments
```

In this guide, we use the [Incidents Management reference sample app](https://github.com/cap-js/incidents-app) as the base application, to add `Attachments` type to the CDS model.

> [!Note]
> To be able to use the Fiori *uploadTable* feature, you must ensure ^1.121.0 SAPUI5 version is updated in the application's *index.html*

## Use Event Mesh Monitoring

## Contributing

This project is open to feature requests/suggestions, bug reports etc. via [GitHub issues](https://github.com/cap-js/attachments/issues). Contribution and feedback are encouraged and always welcome. For more information about how to contribute, the project structure, as well as additional contribution information, see our [Contribution Guidelines](CONTRIBUTING.md).

## Code of Conduct

We as members, contributors, and leaders pledge to make participation in our community a harassment-free experience for everyone. By participating in this project, you agree to abide by its [Code of Conduct](CODE_OF_CONDUCT.md) at all times.

## Licensing

Copyright 2024 SAP SE or an SAP affiliate company and contributors. Please see our [LICENSE](LICENSE) for copyright and license information. Detailed information including third-party components and their licensing/copyright information is available [via the REUSE tool](https://api.reuse.software/info/github.com/cap-js/attachmentstea).
