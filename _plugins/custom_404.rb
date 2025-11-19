Jekyll::Hooks.register :site, :post_write do |site|
  # Chemin du fichier 404 custom
  custom_404 = File.join(site.source, '404-custom.html')
  output_404 = File.join(site.dest, '404.html')
  
  if File.exist?(custom_404)
    # Copier le 404 custom après la génération du site
    FileUtils.cp(custom_404, output_404)
  end
end