#!/usr/bin/env python3
"""
Script pour récupérer la progression HTB Academy
Récupère les données du Penetration Tester Path
"""

import requests
import json
import os
from datetime import datetime

# Configuration
HTB_USERNAME = "Arcony"
PATH_ID = 16  # Penetration Tester Path
BASE_URL = "https://academy.hackthebox.com"

def get_htb_progress():
    """
    Récupère la progression sur HTB Academy
    """
    
    # Headers pour l'authentification
    headers = {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0',
        'Accept': 'application/json',
        'Referer': f'{BASE_URL}/beta/dashboard',
        'Origin': BASE_URL,
    }
    
    # Cookies d'authentification (récupérés depuis les variables d'environnement)
    cookies = {
        'XSRF-TOKEN': os.environ.get('HTB_XSRF_TOKEN', ''),
        'academy_session': os.environ.get('HTB_SESSION', ''),
    }
    
    session = requests.Session()
    session.headers.update(headers)
    session.cookies.update(cookies)
    
    try:
        # Récupérer les informations du path
        path_url = f"{BASE_URL}/api/v1/paths/{PATH_ID}/progress"
        response = session.get(path_url, timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            
            # Extraire les informations pertinentes
            progress_data = {
                'username': HTB_USERNAME,
                'path_id': PATH_ID,
                'path_name': 'Penetration Tester',
                'last_updated': datetime.now().isoformat(),
                'overall_progress': 0,
                'completed_modules': 0,
                'total_modules': 0,
                'current_module': None,
                'modules': []
            }
            
            # Parser les données selon la structure de l'API HTB
            if 'data' in data:
                path_data = data['data']
                
                # Progression globale
                if 'progress' in path_data:
                    progress_data['overall_progress'] = path_data['progress']
                
                # Modules
                if 'modules' in path_data:
                    modules = path_data['modules']
                    progress_data['total_modules'] = len(modules)
                    
                    for module in modules:
                        module_info = {
                            'name': module.get('name', 'Unknown'),
                            'completed': module.get('completed', False),
                            'progress': module.get('progress', 0),
                            'tier': module.get('tier', 0)
                        }
                        
                        progress_data['modules'].append(module_info)
                        
                        if module_info['completed']:
                            progress_data['completed_modules'] += 1
                        elif module_info['progress'] > 0 and not progress_data['current_module']:
                            progress_data['current_module'] = module_info['name']
            
            # Calculer le pourcentage si pas fourni par l'API
            if progress_data['overall_progress'] == 0 and progress_data['total_modules'] > 0:
                progress_data['overall_progress'] = int(
                    (progress_data['completed_modules'] / progress_data['total_modules']) * 100
                )
            
            return progress_data
            
        else:
            print(f"Erreur API: Status {response.status_code}")
            print(f"Response: {response.text}")
            return None
            
    except Exception as e:
        print(f"Erreur lors de la récupération des données: {e}")
        return None

def save_progress(progress_data):
    """
    Sauvegarde les données dans un fichier JSON
    """
    if progress_data:
        # Créer le dossier _data s'il n'existe pas
        os.makedirs('_data', exist_ok=True)
        
        # Sauvegarder dans _data/htb-progress.json
        with open('_data/htb-progress.json', 'w') as f:
            json.dump(progress_data, f, indent=2)
        
        print("✓ Données sauvegardées dans _data/htb-progress.json")
        print(f"  Progression: {progress_data['overall_progress']}%")
        print(f"  Modules complétés: {progress_data['completed_modules']}/{progress_data['total_modules']}")
        if progress_data['current_module']:
            print(f"  Module en cours: {progress_data['current_module']}")
        
        return True
    else:
        print("✗ Aucune donnée à sauvegarder")
        return False

def main():
    print("Récupération de la progression HTB Academy...")
    print(f"Utilisateur: {HTB_USERNAME}")
    print(f"Path: Penetration Tester (ID: {PATH_ID})")
    print("-" * 50)
    
    progress = get_htb_progress()
    
    if progress:
        save_progress(progress)
    else:
        print("Échec de la récupération des données")
        exit(1)

if __name__ == "__main__":
    main()