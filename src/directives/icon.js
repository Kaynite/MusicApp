export default {
  beforeMount(el, binding) {
    let className = `fa fa-${binding.value} text-2xl`;

    if (binding.arg == "custom") {
      className = binding.value;
    }

    if (binding.modifiers.right) {
      className += " float-right";
    }

    if (binding.modifiers.yellow) {
      className += " text-yellow-500";
    } else {
      className += " text-green-500";
    }

    el.innerHTML += `<i class="${className}"></i>`;
  },
};
