export default function Footer() {
    return (
        <footer className="w-full border-t bg-white text-center text-sm text-gray-500 py-4">
            &copy; {new Date().getFullYear()} CodeBuild. All rights reserved.
        </footer>
    );
}