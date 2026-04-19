export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-950 py-8 text-center text-sm text-neutral-500">
      <p>
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold text-white">YH Store</span>. All rights
        reserved.
      </p>
    </footer>
  );
}
