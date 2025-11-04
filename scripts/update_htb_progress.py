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
    Récupère la progression sur HTB Academy en utilisant la bonne API v2
    """
    
    # Headers pour l'authentification
    headers = {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0',
        'Accept': 'application/json',
        'Accept-Language': 'fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Referer': f'{BASE_URL}/beta/dashboard',
        'Origin': BASE_URL,
        'Connection': 'keep-alive',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        'Priority': 'u=4',
        'TE': 'trailers'
    }
    
    # Cookies d'authentification (récupérés depuis les variables d'environnement)
    xsrf_token = os.environ.get('HTB_XSRF_TOKEN', '')
    session_token = os.environ.get('HTB_SESSION', '')
    
    if not xsrf_token or not session_token:
        print("⚠️ Tokens d'authentification manquants!")
        print("Assurez-vous que HTB_XSRF_TOKEN et HTB_SESSION sont définis.")
        return None
    
    cookies = {
        'XSRF-TOKEN': xsrf_token,
        'htb_academy_session': session_token,
    }
    
    session = requests.Session()
    session.headers.update(headers)
    session.cookies.update(cookies)
    
    try:
        # Récupérer les modules du path avec l'état "in_progress"
        # Route API v2 correcte
        modules_url = f"{BASE_URL}/api/v2/paths/{PATH_ID}/modules"
        
        print(f"📡 Requête: {modules_url}")
        print(f"   État: in_progress")
        
        params = {
            'state': 'in_progress'
        }
        
        response = session.get(modules_url, params=params, timeout=30)
        
        print(f"📊 Statut de la réponse: {response.status_code}")
        
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
                'total_modules': 28,  # Total connu du path
                'current_module': 'En attente de mise à jour',
                'modules': []
            }
            
            # Parser les données selon la structure de l'API HTB v2
            if 'data' in data:
                modules = data['data']
                print(f"📚 Modules récupérés: {len(modules)}")
                
                for module in modules:
                    module_info = {
                        'id': module.get('id', 0),
                        'name': module.get('name', 'Unknown'),
                        'slug': module.get('slug', ''),
                        'progress': module.get('progress', 0),
                        'state': module.get('state', 'not_started'),
                        'sections_count': module.get('sections_count', 0),
                        'current_section_id': module.get('current_section_id', None),
                        'difficulty': module.get('difficulty', {}).get('text', 'Unknown'),
                        'tier': module.get('tier', {}).get('name', 'Unknown'),
                        'estimated_time': module.get('estimated_time_of_completion', 'Unknown')
                    }
                    
                    progress_data['modules'].append(module_info)
                    
                    # Si le module est en cours, c'est celui-ci qu'on affiche
                    # CORRECTION: Ne plus vérifier progress > 0, juste le state
                    if module_info['state'] == 'in_progress':
                        progress_data['current_module'] = module_info['name']
                        print(f"📖 Module en cours: {module_info['name']} ({module_info['progress']}%)")
            
            # Récupérer TOUS les modules du path (sans filtre state)
            all_modules_url = f"{BASE_URL}/api/v2/paths/{PATH_ID}/modules"
            
            print(f"📡 Requête tous les modules: {all_modules_url}")
            
            all_modules_response = session.get(all_modules_url, timeout=30)
            
            print(f"📊 Statut réponse tous modules: {all_modules_response.status_code}")
            
            if all_modules_response.status_code == 200:
                all_modules_data = all_modules_response.json()
                
                if 'data' in all_modules_data:
                    all_modules = all_modules_data['data']
                    print(f"📚 Total modules récupérés: {len(all_modules)}")
                    
                    # Filtrer les modules complétés
                    completed_modules = [m for m in all_modules if m.get('state') == 'completed']
                    progress_data['completed_modules'] = len(completed_modules)
                    print(f"✅ Modules complétés: {progress_data['completed_modules']}")
                    
                    # Ajouter les modules complétés à la liste (s'ils ne sont pas déjà là)
                    existing_ids = [m['id'] for m in progress_data['modules']]
                    
                    for module in completed_modules:
                        if module.get('id') not in existing_ids:
                            module_info = {
                                'id': module.get('id', 0),
                                'name': module.get('name', 'Unknown'),
                                'slug': module.get('slug', ''),
                                'progress': 100,  # Complété = 100%
                                'state': 'completed',
                                'sections_count': module.get('sections_count', 0),
                                'current_section_id': None,
                                'difficulty': module.get('difficulty', {}).get('text', 'Unknown'),
                                'tier': module.get('tier', {}).get('name', 'Unknown'),
                                'estimated_time': module.get('estimated_time_of_completion', 'Unknown')
                            }
                            progress_data['modules'].append(module_info)
                            print(f"   ✓ {module_info['name']}")
                else:
                    print("⚠️ Pas de clé 'data' dans la réponse tous modules")
            else:
                print(f"❌ Erreur requête tous modules: {all_modules_response.status_code}")
                print(f"   Réponse: {all_modules_response.text}")
            
            # Calculer le pourcentage de progression
            if progress_data['total_modules'] > 0:
                progress_data['overall_progress'] = int(
                    (progress_data['completed_modules'] / progress_data['total_modules']) * 100
                )
            
            print(f"📈 Progression globale: {progress_data['overall_progress']}%")
            
            return progress_data
            
        else:
            print(f"❌ Erreur API: Status {response.status_code}")
            print(f"Response: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Erreur lors de la récupération des données: {e}")
        import traceback
        traceback.print_exc()
        return None

def save_progress(progress_data):
    """
    Sauvegarde les données dans un fichier JSON
    """
    if progress_data:
        # Créer le dossier _data s'il n'existe pas
        os.makedirs('_data', exist_ok=True)
        
        # Sauvegarder dans _data/htb-progress.json
        with open('_data/htb-progress.json', 'w', encoding='utf-8') as f:
            json.dump(progress_data, f, indent=2, ensure_ascii=False)
        
        print("\n" + "="*50)
        print("✅ Données sauvegardées dans _data/htb-progress.json")
        print("="*50)
        print(f"📊 Progression: {progress_data['overall_progress']}%")
        print(f"📚 Modules complétés: {progress_data['completed_modules']}/{progress_data['total_modules']}")
        if progress_data['current_module']:
            print(f"📖 Module en cours: {progress_data['current_module']}")
        print(f"🕐 Dernière mise à jour: {progress_data['last_updated']}")
        print("="*50)
        
        return True
    else:
        print("❌ Aucune donnée à sauvegarder")
        return False

def main():
    print("="*50)
    print("🎯 HTB ACADEMY PROGRESS UPDATER")
    print("="*50)
    print(f"👤 Utilisateur: {HTB_USERNAME}")
    print(f"🎓 Path: Penetration Tester (ID: {PATH_ID})")
    print("="*50)
    print()
    
    progress = get_htb_progress()
    
    if progress:
        save_progress(progress)
        print("\n✅ Script terminé avec succès!")
    else:
        print("\n❌ Échec de la récupération des données")
        print("Vérifiez vos tokens d'authentification dans les secrets GitHub:")
        print("  - HTB_XSRF_TOKEN")
        print("  - HTB_SESSION")
        exit(1)

if __name__ == "__main__":
    main()