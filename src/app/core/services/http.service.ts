import { Injectable } from '@angular/core';
import { 
  HttpRequest, 
  HttpHandler, 
  HttpEvent, 
  HttpInterceptor, 
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpHandlerFn
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpErrorInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Une erreur est survenue';
        
        if (error.error instanceof ErrorEvent) {
          // Erreur côté client
          errorMessage = `Erreur: ${error.error.message}`;
        } else {
          // Erreur côté serveur
          errorMessage = `Code: ${error.status}\nMessage: ${error.message}`;
          
          // Gestion des erreurs spécifiques
          switch (error.status) {
            case 400:
              errorMessage = 'Requête incorrecte. Veuillez vérifier les données envoyées.';
              break;
            case 401:
              errorMessage = 'Non autorisé. Veuillez vous connecter.';
              break;
            case 403:
              errorMessage = 'Accès refusé. Vous n\'avez pas les permissions nécessaires.';
              break;
            case 404:
              errorMessage = 'Ressource non trouvée.';
              break;
            case 500:
              errorMessage = 'Erreur interne du serveur. Veuillez réessayer plus tard.';
              break;
            case 0:
              errorMessage = 'Impossible de se connecter au serveur. Vérifiez votre connexion Internet.';
              break;
          }
        }
        
        console.error('HTTP Error:', errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}

export const httpInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const interceptor = new HttpErrorInterceptor();
  const nextHandler: HttpHandler = {
    handle: (req: HttpRequest<unknown>) => next(req)
  };
  
  return interceptor.intercept(req, nextHandler).pipe(
    catchError((error) => {
      console.error('HTTP Error (interceptor):', error);
      return throwError(() => error);
    })
  ) as any;
};
