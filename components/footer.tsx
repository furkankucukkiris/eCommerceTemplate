const Footer = () => {
  return (
    <footer className="bg-white border-t">
      <div className="mx-auto py-10">
        <p className="text-center text-xs text-black">
          &copy; 2024 E-Store Template. All rights reserved.
        </p>
        <div className="flex justify-center items-center mt-4 gap-2">
          <span className="text-xs text-muted-foreground">Designed & Built by</span>
          <a 
            href="https://github.com/furkankucukkiris" 
            target="_blank" 
            className="group relative inline-flex items-center justify-center px-3 py-1 text-xs font-bold text-white transition-all duration-200 bg-zinc-900 rounded hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900"
          >
            {/* AFK Logo Alanı */}
            <span className="mr-1 tracking-tighter">AFK</span> 
            {/* Creative Yazısı - Hover olunca renk değişsin */}
            <span className="text-purple-400 group-hover:text-purple-300 transition-colors">Creative</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;